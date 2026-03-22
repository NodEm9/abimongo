# Defining Models

---

## Overview

Models are the primary interface for interacting with MongoDB in Abimongo.

A model represents a collection and provides methods for:

- creating documents
- querying data
- updating records
- deleting entries
- running aggregations

---

## Creating a Model

To define a model, you need:

- a `collectionName`
- a `schema`
- optionally a `provider`

```ts
import { AbimongoModel } from '@abimongo/core';
import { AbimongoSchema } from '@abimongo/core';

const UserSchema = new AbimongoSchema({
  name: { type: String, required: true },
  email: { type: String, required: true }
});

export const UserModel = new AbimongoModel({
  collectionName: 'users',
  schema: UserSchema
});
```
---

### Required options

- `collectionName` 
The MongoDB collection name:

```ts
collectionName: 'users'
```

- `schema` 
Defines structure and validation:

```ts
schema: userSchema
```

---

### Optional options

- `provider` — custom database provider.

```ts
provider: myProvider;
```

(if omitted, Abimongo uses the default provider).

- `ctx` — (default context) 
Set default context for the model:

```ts
ctx: {
  tenantId: 'defaultTenant',
  dbName: 'app_db'
}
```

- `collection`
 override the collection instance (useful for tests).

 ```ts
 collection: mockCollection;
 ```

 ---

## Model lifecycle

When a model is created the configuration is validated, the schema is initialized, middleware hooks are registered, and optional GC/index settings are applied.

---

## Basic usage

```ts
await UserModel.create({ name: 'Alice' });

const users = await UserModel.find({});
const user = await UserModel.findOne({ email: 'alice@example.com' });

await UserModel.updateOne(
  { email: 'alice@example.com' },
  { $set: { name: 'Updated' } }
);

await UserModel.deleteOne({ email: 'alice@example.com' });
```

## Model instance vs bound model

Models can be reused or bound to a specific context:

```ts
const tenantModel = UserModel.bind({ tenantId: 'tenantA' });
```

---

## Best practices

- Keep models focused on a single collection.
- Separate schema and model definitions.
- Use middleware for cross-cutting logic.
- Avoid embedding business logic directly in models.

---
