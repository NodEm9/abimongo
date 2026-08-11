import Fastify from 'fastify';
import { createFastifyAdapter } from '../fastify-adapter.js';

describe('Fastify adapter', () => {
  it('should install preHandler hook without throwing', async () => {
    const app = Fastify();
    const adapter = createFastifyAdapter();

    await expect(
      adapter.install(app, {
        tenancy: {
          header: 'x-tenant-id',
          fallback: 'default'
        }
      })
    ).resolves.toBeUndefined();
  });
});