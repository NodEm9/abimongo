[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / Relationship

# Interface: Relationship\<T\>

Defined in: [core/src/types/abimongo.mode.type.ts:64](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/types/abimongo.mode.type.ts#L64)

Represents a relationship between collections in MongoDB.

## Type Parameters

### T

`T` = `any`

The type of the document in the collection.

## Properties

### localField

> **localField**: keyof `T`

Defined in: [core/src/types/abimongo.mode.type.ts:73](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/types/abimongo.mode.type.ts#L73)

The field in the current document that holds the reference.

***

### ref

> **ref**: `string`

Defined in: [core/src/types/abimongo.mode.type.ts:68](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/types/abimongo.mode.type.ts#L68)

The name of the referenced collection.
