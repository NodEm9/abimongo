import { createYogaContextFactory } from '../yoga.js';

describe('createYogaContextFactory', () => {
  it('should create a context factory', async () => {
    const factory = createYogaContextFactory({
      tenancy: {
        header: 'x-tenant-id',
        fallback: 'default'
      }
    });

    const request = new Request('http://localhost/graphql', {
      method: 'POST',
      headers: {
        'x-tenant-id': 'tenantA'
      }
    });

    const result = await factory({ request });

    expect(result).toEqual({});
  });
});