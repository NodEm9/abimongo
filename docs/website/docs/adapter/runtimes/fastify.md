# Fastify Adapter

The Fastify adapter integrates Abimongo using Fastify hooks.

---

## Installation

```bash
npm install @abimongo/adapter-fastify
```

## Usage

```ts
import Fastify from 'fastify';
import { installFastifyAdapter } from '@abimongo/adapter-fastify';

const app = Fastify();

await createFastifyAdapter(app, {
  tenancy: {
    header: 'x-tenant-id',
    fallback: 'default'
  },
  enableTransactions: true
});
```

### How it works

The adapter registers a hook:

```ts
app.addHook('onRequest', ...)
```

**Each request:**

- is normalized into AbimongoRequestLike.
- initializes context.
- optionally starts a transaction.

### Example route

```ts
app.get('/users', async (req, reply) => {
  const users = await UserModel.find({});
  return users;
});
```

> [!Note]
> Fastify has better performance than Express
> Async context propagation works cleanly with hooks

### When to use

Use this adapter if:

- you prefer high-performance Node APIs
- you are using Fastify ecosystem