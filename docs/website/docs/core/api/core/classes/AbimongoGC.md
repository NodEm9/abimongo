# Class: AbimongoGC

Defined in: packages/core/src/gc/AbimongoGC.ts:24

## Constructors

### Constructor

> **new AbimongoGC**(`options`): `AbimongoGC`

Defined in: packages/core/src/gc/AbimongoGC.ts:33

#### Parameters

##### options

`GCOptions` = `{}`

#### Returns

`AbimongoGC`

## Methods

### register()

> **register**(`collection`, `schema`): `void`

Defined in: packages/core/src/gc/AbimongoGC.ts:86

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

Defined in: packages/core/src/gc/AbimongoGC.ts:102

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(): `void`

Defined in: packages/core/src/gc/AbimongoGC.ts:90

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: packages/core/src/gc/AbimongoGC.ts:96

#### Returns

`void`
