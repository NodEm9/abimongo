# Function: createModel()

> **createModel**\<`T`\>(`params`): [`AbimongoModel`](../classes/AbimongoModel.md)\<`T`\>

Defined in: packages/core/src/utils/builders/createModel.ts:43

Creates a new model for a MongoDB collection.
In Multi-Tenancy mode, the model will be created for the specified tenant.
If no tenant ID is provided, the model will be created for the default tenant.
Note: Once a the applyMultiTenancy() middleware is applied to a connection to register tenant/s, the tenantId will be automatically set for all models created after that.
This allows you to create models for different tenants without having to specify the tenantId each time. Then a tenantId or db instance or client instance is required to create a model.

## Type Parameters

### T

`T` *extends* [`Document`](../type-aliases/Document.md) = `any`

The type of the document in the collection.

## Parameters

### params

`CreateModelParams`\<`T`\>

The parameters for creating the model.

## Returns

[`AbimongoModel`](../classes/AbimongoModel.md)\<`T`\>

The created model.

## Example

```ts
const userSchema = createSchema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
});

const userModel = createModel({
  name: 'users',
  schema: userSchema,
  tenantId: 'tenant1', // Optional tenant ID for multi-tenancy
  db: dbInstance, // Your MongoDB Db instance
  client: mongoClient, // Your MongoDB Client instance
});
```
