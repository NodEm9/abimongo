import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { AbimongoSchema, AbimongoModel } from '../../lib-core';
import { AbimongoGC } from '../../gc/AbimongoGC';
import { Document } from '../../types';
import { shutdownLogger } from '@abimongo/logger';
import { bufferedTransporter } from '../../utils';

describe('AbimongoGC', () => {
  let client: MongoClient;
  let db: any;
  let gc = new AbimongoGC({ interval: '1s' });

  jest.setTimeout(60000);
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    client = new MongoClient(mongoServer.getUri());
    await client.connect();
    db = await client.db('test_gc');
  });

  it('should soft-delete expired documents', async () => {
    const mockDb = db = client.db('test_gc');
    const schema = new AbimongoSchema<Document>({
      name: String,
      createdAt: { type: Date, default: () => new Date(Date.now() - 1000 * 60 * 60 * 24 * 31) }, // 31 days ago
    }).setGCConfig({
      ttlField: 'createdAt',
      expiresIn: '30d',
      softDelete: true,
    });

    const model = new AbimongoModel({
      db: mockDb, // Pass the db instance
      collectionName: 'posts', // Pass the collection name as a string
      schema,
    });

    await model.create({ name: 'Old Post' });

    gc.register(model.collection, schema);
    await gc['cleanup'](
      model.collection,
      schema.getGCConfig()!
    );

    const result = await model.collection.findOne({ name: 'Old Post' });
    result?._id.toString(); // Ensure the document is found
    result?.deletedAt; // Access deletedAt field to ensure soft-delete worked

    expect(result).not.toBeNull(); // Document should be soft-deleted
    expect(result?.deletedAt).not.toBeNull();
  });
  afterAll(async () => {
    await client.close();
    await shutdownLogger();
  });
});
