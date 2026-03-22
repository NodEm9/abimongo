# Project Setup

---

This guide shows how to structure a production-ready Abimongo project.

---

## Recommended folder structure

```bash
src/
├── models/
│   └── user.model.ts
├── schemas/
│   └── user.schema.ts
├── context/
│   └── context.ts
├── config/
│   └── database.ts
├── services/
│   └── user.service.ts
└── app.ts
```

## 1. Configure database provider

Abimongo uses a provider pattern to resolve database connections.

```ts
import { createAbimongoClientModule } from '@abimongo/core';

export const provider = createAbimongoClientModule({
  uri: process.env.MONGO_URI!,
  options: {
    dbName: 'app_db'
  }
});
```

## 2. Initialize provider

```ts
await provider.connect();
```

## 3. Define schema

```ts
import { AbimongoSchema } from '@abimongo/core';

export const UserSchema = new AbimongoSchema({
  name: { type: String, required: true },
  email: { type: String, required: true }
});
```

## 4. Create model

```ts
import { AbimongoModel } from '@abimongo/core';
import { UserSchema } from '../schemas/user.schema';
import { provider } from '../config/database';

export const UserModel = new AbimongoModel({
  collectionName: 'users',
  schema: UserSchema,
  provider
});
```

## 5. Use in services

```ts
export async function createUser(data: any) {
  return UserModel.create(data);
}

export async function getUsers() {
  return UserModel.find({});
}
```

## 6. Request context setup

For multi-tenant or request-aware applications, run code inside an `AbimongoContext` so request-level data (tenant, request id, etc.) is available.

```ts
import { AbimongoContext } from '@abimongo/core';

export async function handleRequest(req, res) {
  await AbimongoContext.run(
    {
      tenantId: req.headers['x-tenant-id'],
      requestId: req.id
    },
    async () => {
      const users = await UserModel.find({});
      res.json(users);
    }
  );
}
```

## 7. Transactions setup

```ts
await AbimongoContext.withTransaction(async () => {
  await UserModel.create({ name: 'Alice' });
});
```

## Best practices

- Keep schemas and models separate.
- Use `AbimongoContext` for request-level data.
- Avoid passing sessions manually when possible.
- Use middleware for cross-cutting logic (validation, auditing, etc.).

## Next steps

- Explore the core `Context` system.
- Learn about `Middleware` and how to plug into model operations.
- Review `Transactions` and error handling patterns.
