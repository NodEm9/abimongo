[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoGC

# Class: AbimongoGC

Defined in: [src/gc/AbimongoGC.ts:24](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/gc/AbimongoGC.ts#L24)

## Constructors

### Constructor

> **new AbimongoGC**(`options`): `AbimongoGC`

Defined in: [src/gc/AbimongoGC.ts:33](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/gc/AbimongoGC.ts#L33)

#### Parameters

##### options

`GCOptions` = `{}`

#### Returns

`AbimongoGC`

## Methods

### register()

> **register**(`collection`, `schema`): `void`

Defined in: [src/gc/AbimongoGC.ts:86](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/gc/AbimongoGC.ts#L86)

#### Parameters

##### collection

`Collection`\<`any`\>

##### schema

[`AbimongoSchema`](AbimongoSchema.md)\<[`Document`](../type-aliases/Document.md)\>

#### Returns

`void`

***

### runOnce()

> **runOnce**(): `Promise`\<`void`\>

Defined in: [src/gc/AbimongoGC.ts:102](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/gc/AbimongoGC.ts#L102)

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(): `void`

Defined in: [src/gc/AbimongoGC.ts:90](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/gc/AbimongoGC.ts#L90)

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [src/gc/AbimongoGC.ts:96](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/gc/AbimongoGC.ts#L96)

#### Returns

`void`
