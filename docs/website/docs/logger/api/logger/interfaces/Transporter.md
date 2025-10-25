# Interface: Transporter

Defined in: types/logger.types.ts:12

## Methods

### close()?

> `optional` **close**(): `void`

Defined in: types/logger.types.ts:15

#### Returns

`void`

***

### flush()?

> `optional` **flush**(): `Promise`\<`void`\>

Defined in: types/logger.types.ts:14

#### Returns

`Promise`\<`void`\>

***

### write()

> **write**(`message`, `level?`, `meta?`): `Promise`\<`void`\>

Defined in: types/logger.types.ts:13

#### Parameters

##### message

`string`

##### level?

[`LogLevel`](../type-aliases/LogLevel.md)

##### meta?

`any`[]

#### Returns

`Promise`\<`void`\>
