# Schema

---

## Overview

`AbimongoSchema` defines the structure, validation, and relationships of your data. It ensures consistency and allows you to attach lifecycle hooks and document-level behavior.

---

## Creating a schema

```ts
import { AbimongoSchema } from '@abimongo/core';

export const UserSchema = new AbimongoSchema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number }
});
```

## Field options

Each field supports options such as:

| Option | Description |
| --- | --- |
| `type` | Data type (String, Number, Object, Array, etc.) |
| `required` | Whether the field is mandatory |
| `schema` | Nested schema for objects |

## Validation

Schemas automatically validate documents on create/update. For example:

```ts
await UserModel.create({
  name: 'Alice'
  // missing required `email` will throw a validation error
});
```

## Nested objects

```ts
const UserSchema = new AbimongoSchema({
  profile: {
    type: Object,
    schema: new AbimongoSchema({
      bio: { type: String }
    })
  }
});
```

## Arrays

```ts
tags: { type: Array }
```

## ObjectId handling

Abimongo will automatically cast string IDs to `ObjectId` and arrays of IDs to `ObjectId[]` where appropriate.

## Relationships

Schemas can expose relationship metadata (e.g. `schema.getRelationships()`), which can be useful for middleware and aggregation helpers.

## Lifecycle hooks

Schemas support document-level hooks:

```ts
schema.pre('pre-save', async (doc) => {
  doc.createdAt = new Date();
});

schema.post('post-save', async (doc) => {
  console.log('Saved:', doc);
});
```

### Common hooks

- `pre-save`
- `post-save`
- `pre-update`
- `post-update`
- `deleteOne`
- `aggregate`

## Middleware integration

Schema hooks operate at the document level and work alongside model-level middleware (which runs at query/operation level).

## Best practices

- Keep schemas simple and focused.
- Use hooks for data integrity and small transformations.
- Avoid deeply nested structures unless necessary; prefer references for complex relations.

Next Step

👉 Context Binding