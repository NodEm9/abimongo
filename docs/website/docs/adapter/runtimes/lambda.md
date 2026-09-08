# Lambda Adapter

The Lambda adapter integrates Abimongo into serverless environments like AWS Lambda.

---

## Installation

```bash
npm install @abimongo/adapter-lambda
```

## Usage

```ts
import { createLambdaAdapter } from '@abimongo/adapter-lambda';

export const handler = createLambdaAdapter(
  async (event) => {
    const users = await UserModel.find({});

    return {
      statusCode: 200,
      body: JSON.stringify(users)
    };
  },
  {
    tenancy: {
      header: 'x-tenant-id',
      fallback: 'default'
    },
    enableTransactions: true
  }
);
```

### How it works

- Wraps your Lambda handler.
- Converts event → request-like object.
- Initializes `AbimongoContext`.
- Executes handler inside context.

### Supported event types

- API Gateway (v1 & v2).
- Lambda function URLs.
- Custom events (with headers).

### Benefits

- No repeated boilerplate.
- Automatic tenant resolution.
- Consistent behavior across serverless functions.

> [!Note]
>
> - No dependency on AWS SDK required.
> - Works with any serverless platform that resembles Lambda.

### When to use

Use this adapter if:

- you are building serverless APIs
- you deploy on AWS Lambda or similar platforms