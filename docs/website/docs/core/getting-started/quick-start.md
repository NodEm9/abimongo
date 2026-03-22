# Quick Start

This guide walks you through creating your first schema and model, then performing basic CRUD operations with Abimongo.

---

## 1) Define a schema

```ts
import { AbimongoSchema } from '@abimongo/core';

const UserSchema = new AbimongoSchema({
  name: { type: String, required: true },
  email: { type: String, required: true }
});
```

## 2) Create a model

```ts
import { AbimongoModel } from '@abimongo/core';

const UserModel = new AbimongoModel({
  collectionName: 'users',
  schema: UserSchema
});
```

## 3) Insert data

```ts
await UserModel.create({
  name: 'Alice',
  email: 'alice@example.com'
});
```

## 4) Query data

```ts
const users = await UserModel.find({});
const user = await UserModel.findOne({ email: 'alice@example.com' });
```

## 5) Update data

```ts
await UserModel.updateOne(
  { email: 'alice@example.com' },
  { $set: { name: 'Alice Updated' } }
);
```

## 6) Delete data

```ts
await UserModel.deleteOne({ email: 'alice@example.com' });
```

## 7) Using context (optional)

You can run operations within a request-scoped context to propagate tenant/request metadata and sessions:

```ts
import { AbimongoContext } from '@abimongo/core';

await AbimongoContext.run({ tenantId: 'tenantA' }, async () => {
  await UserModel.find({});
});
```

## What you just did

- Defined a schema
- Created a model
- Performed CRUD operations
- Used request-scoped context (optional)

## Next step

Learn how to structure your project and add tooling in the Project Setup guide:

- 👉 [Project Setup](./project-setup.md)
