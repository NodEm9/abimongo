import { AbimongoSchema } from '../../lib-core';
import { AbimongoGC } from '../../gc/AbimongoGC';
import { Document } from '../../types';
import { bufferedTransporter } from '../../utils';
import { shutdownLogger } from '@abimongo/logger';

/**
 * This test avoids starting a real MongoDB instance by providing a
 * tiny in-memory mock of the MongoDB collection API used by the GC.
 */
describe('AbimongoGC (mocked DB)', () => {
  let gc = new AbimongoGC({ interval: '1s' });

  // Simple in-memory collection mock
  function createFakeCollection(name = 'posts') {
    let docs: any[] = [];
    return {
      collectionName: name,
      async insertOne(doc: any) {
        const _id = `${Date.now()}_${Math.random()}`;
        const document = { _id, ...doc };
        docs.push(document);
        return { insertedId: _id };
      },
      async findOne(filter: any) {
        return docs.find(d => {
          return Object.keys(filter).every(k => d[k] === filter[k]);
        }) || null;
      },
      async updateMany(filter: any, update: any) {
        const matched = docs.filter(d => {
          // Support only $lte on a single field used by test
          const field = Object.keys(filter)[0];
          const condition = filter[field];
          if (condition && condition.$lte) {
            return new Date(d[field]) <= condition.$lte;
          }
          return false;
        });
        const set = update.$set || {};
        for (const m of matched) Object.assign(m, set);
        return { matchedCount: matched.length };
      },
      async deleteMany(_filter: any) {
        // not used by this test
        return { deletedCount: 0 };
      },
      // For AbimongoModel compatibility if used elsewhere
      async toArray() { return docs; }
    } as any;
  }

  jest.setTimeout(10000);

  it('should soft-delete expired documents', async () => {
    const schema = new AbimongoSchema<Document>({
      name: String,
      createdAt: { type: Date, default: () => new Date(Date.now() - 1000 * 60 * 60 * 24 * 31) }, // 31 days ago
    }).setGCConfig({
      ttlField: 'createdAt',
      expiresIn: '30d',
      softDelete: true,
    });

    const fakeCollection = createFakeCollection('posts');

    // Insert an expired document
    await fakeCollection.insertOne({ name: 'Old Post', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 31) });

    // Register the collection/schema with GC and run cleanup
    gc.register(fakeCollection, schema as any);
    await (gc as any)['cleanup'](fakeCollection, schema.getGCConfig()!);

    const result = await fakeCollection.findOne({ name: 'Old Post' });
    expect(result).not.toBeNull();
    expect(result?.deletedAt).toBeDefined();
  });

  afterAll(async () => {
    await bufferedTransporter.stop();
    await shutdownLogger();
  });
});
