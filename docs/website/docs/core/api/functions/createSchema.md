[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / createSchema

# Function: createSchema()

> **createSchema**\<`T`\>(`schema`): [`AbimongoSchema`](../classes/AbimongoSchema.md)\<`T`\>

Defined in: [packages/core/src/utils/builders/schema.ts:23](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/utils/builders/schema.ts#L23)

Creates a new AbimongoSchema instance with the provided schema definition.

## Type Parameters

### T

`T` *extends* [`Document`](../type-aliases/Document.md)

The type of the document.

## Parameters

### schema

The schema definition for the document.

[`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<`T`\> | `Record`\<keyof `T`, `any`\>

## Returns

[`AbimongoSchema`](../classes/AbimongoSchema.md)\<`T`\>

The created AbimongoSchema instance.

## Example

```ts
const userSchema = createSchema({
  name: { type: String, required: true },
 age: { type: Number, required: true },
 email: { type: String, required: true },
});
const userModel = new AbimongoModel(userSchema, 'users', db);
	
const user = await userModel.create({ name: 'John Doe', age: 30, email: 'example.com' });
console.log(user); // { _id: '...', name: 'John Doe', age: 30, email: 'example.com' }
```
