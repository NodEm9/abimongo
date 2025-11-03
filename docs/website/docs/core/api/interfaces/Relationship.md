[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / Relationship

# Interface: Relationship\<T\>

Defined in: [core/src/types/abimongo.mode.type.ts:64](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/types/abimongo.mode.type.ts#L64)

Represents a relationship between collections in MongoDB.

## Type Parameters

### T

`T` = `any`

The type of the document in the collection.

## Properties

### localField

> **localField**: keyof `T`

Defined in: [core/src/types/abimongo.mode.type.ts:73](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/types/abimongo.mode.type.ts#L73)

The field in the current document that holds the reference.

***

### ref

> **ref**: `string`

Defined in: [core/src/types/abimongo.mode.type.ts:68](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/types/abimongo.mode.type.ts#L68)

The name of the referenced collection.
