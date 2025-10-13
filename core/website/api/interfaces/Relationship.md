[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / Relationship

# Interface: Relationship\<T\>

Defined in: [src/types/abimongo.mode.type.ts:64](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.mode.type.ts#L64)

Represents a relationship between collections in MongoDB.

## Type Parameters

### T

`T` = `any`

The type of the document in the collection.

## Properties

### localField

> **localField**: keyof `T`

Defined in: [src/types/abimongo.mode.type.ts:73](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.mode.type.ts#L73)

The field in the current document that holds the reference.

***

### ref

> **ref**: `string`

Defined in: [src/types/abimongo.mode.type.ts:68](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.mode.type.ts#L68)

The name of the referenced collection.
