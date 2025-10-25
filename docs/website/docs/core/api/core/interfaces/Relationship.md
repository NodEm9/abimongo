# Interface: Relationship\<T\>

Defined in: packages/core/src/types/abimongo.mode.type.ts:64

Represents a relationship between collections in MongoDB.

## Type Parameters

### T

`T` = `any`

The type of the document in the collection.

## Properties

### localField

> **localField**: keyof `T`

Defined in: packages/core/src/types/abimongo.mode.type.ts:73

The field in the current document that holds the reference.

***

### ref

> **ref**: `string`

Defined in: packages/core/src/types/abimongo.mode.type.ts:68

The name of the referenced collection.
