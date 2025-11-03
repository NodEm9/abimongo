# Class: AbimongoGC

Defined in: [core/src/gc/AbimongoGC.ts:23](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/gc/AbimongoGC.ts#L23)

## Constructors

### Constructor

> **new AbimongoGC**(`options`): `AbimongoGC`

Defined in: [core/src/gc/AbimongoGC.ts:32](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/gc/AbimongoGC.ts#L32)

#### Parameters

##### options

`GCOptions` = `{}`

#### Returns

`AbimongoGC`

## Methods

### register()

> **register**(`collection`, `schema`): `void`

Defined in: [core/src/gc/AbimongoGC.ts:85](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/gc/AbimongoGC.ts#L85)

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

Defined in: [core/src/gc/AbimongoGC.ts:101](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/gc/AbimongoGC.ts#L101)

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(): `void`

Defined in: [core/src/gc/AbimongoGC.ts:89](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/gc/AbimongoGC.ts#L89)

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [core/src/gc/AbimongoGC.ts:95](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/gc/AbimongoGC.ts#L95)

#### Returns

`void`
