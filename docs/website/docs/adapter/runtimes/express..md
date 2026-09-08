# Express Adapter

The Express adapter integrates Abimongo into Express applications using middleware.

---

## Installation

```bash
npm install @abimongo/adapter-express
```

## Usage

```ts
import express from 'express';
import { createExpressAdapter } from '@abimongo/adapter-express';

const app = express();

createExpressAdapter(app, {
  tenancy: {
    header: 'x-tenant-id',
    fallback: 'default'
  },
  requestIdHeader: 'x-request-id',
  enableTransactions: true
});
```

## How it works

The adapter registers a global middleware:

```ts
app.use(...)
```

**For each request**:

- extracts headers, params, cookies.
- resolves tenant ID.
- initializes AbimongoContext.
- optionally wraps request in a transaction.

### Example route

```ts
app.get('/users', async (req, res) => {
  const users = await UserModel.find({});
  res.json(users);
});
```

> No manual context handling needed.

---

> !Notes
> - Works with Express v4 and v5
> - Requires express as a peer dependency
> - Context is propagated via AsyncLocalStorage

### When to use

Use this adapter if:

- you are building REST APIs with Express.
- you want zero boilerplate context handling.

