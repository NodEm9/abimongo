import { toLambdaAbimongoRequestLike } from '../lambda-request.js';

describe('toLambdaAbimongoRequestLike', () => {
  it('should normalize headers and params from lambda event', () => {
    const req = toLambdaAbimongoRequestLike({
      headers: {
        'x-tenant-id': 'tenantA'
      },
      pathParameters: {
        userId: '123'
      },
      httpMethod: 'GET',
      path: '/users/123'
    });

    expect(req.get?.('x-tenant-id')).toBe('tenantA');
    expect(req.params?.userId).toBe('123');
    expect(req.method).toBe('GET');
    expect(req.url).toBe('/users/123');
  });
});