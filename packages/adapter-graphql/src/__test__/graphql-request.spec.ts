import { toGraphqlAbimongoRequestLike } from '../graphql-request.js';

describe('toGraphqlAbimongoRequestLike', () => {
  it('should normalize plain object headers', () => {
    const req = toGraphqlAbimongoRequestLike({
      headers: {
        'x-tenant-id': 'tenantA',
        'x-request-id': 'req-1'
      },
      url: '/graphql',
      method: 'POST'
    });

    expect(req.get?.('x-tenant-id')).toBe('tenantA');
    expect(req.get?.('x-request-id')).toBe('req-1');
  });
});