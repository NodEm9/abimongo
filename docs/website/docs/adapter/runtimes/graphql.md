# GraphQL Adapter

The GraphQL adapter integrates Abimongo into GraphQL runtimes like Apollo Server and GraphQL Yoga.

---

## Installation

```bash
npm install @abimongo/adapter-graphql
```

## Supported runtimes

- Apollo Server.
- GraphQL Yoga.
- Any runtime exposing request/context.

### Apollo Server example

```ts
import { createApolloContextFactory } from '@abimongo/adapter-graphql';

const context = createApolloContextFactory({
  tenancy: {
    header: 'x-tenant-id',
    fallback: 'default'
  }
});
```

### Yoga example

```ts
import { createYogaContextFactory } from '@abimongo/adapter-graphql';

const yoga = createYoga({
  schema,
  context: createYogaContextFactory({
    tenancy: {
      header: 'x-tenant-id',
      fallback: 'default'
    }
  })
});
```

## How it works

- GraphQL requests are normalized.
- Context is initialized per request.
- Resolvers access `AbimongoContext`.

### Example resolver

```ts
const resolvers = {
  Query: {
    users: async () => {
      return UserModel.find({});
    }
  }
};
```

---

> [!Note]
>
> - Works with async context propagation.
> - Compatible with subscriptions (future extension)

### When to use

Use this adapter if:

- you are building GraphQL APIs.
- you use Apollo or Yoga.
