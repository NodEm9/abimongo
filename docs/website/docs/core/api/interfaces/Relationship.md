[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / Relationship

# Interface: Relationship\<T\>

Defined in: [packages/core/src/types/abimongo.mode.type.ts:64](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.mode.type.ts#L64)

Represents a relationship between collections in MongoDB.

## Type Parameters

### T

`T` = `any`

The type of the document in the collection.

## Properties

### localField

> **localField**: keyof `T`

Defined in: [packages/core/src/types/abimongo.mode.type.ts:73](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.mode.type.ts#L73)

The field in the current document that holds the reference.

***

### ref

> **ref**: `string`

Defined in: [packages/core/src/types/abimongo.mode.type.ts:68](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.mode.type.ts#L68)

The name of the referenced collection.
