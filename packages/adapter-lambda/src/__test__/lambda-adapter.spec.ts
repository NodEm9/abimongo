import { createLambdaAdapter } from '../lambda-adapter.js';

describe('createLambdaAdapter', () => {
  it('should wrap a lambda handler', async () => {
    const handler = createLambdaAdapter(async () => {
      return {
        statusCode: 200,
        body: 'ok'
      };
    });

    const result = await handler({
      headers: {
        'x-tenant-id': 'tenantA'
      },
      httpMethod: 'GET',
      path: '/'
    });

    expect(result).toEqual({
      statusCode: 200,
      body: 'ok'
    });
  });
});