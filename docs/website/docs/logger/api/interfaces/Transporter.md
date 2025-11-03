[**@abimongo/logger**](../README.md)

***

# Interface: Transporter

Defined in: [types/logger.types.ts:12](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/logger/src/types/logger.types.ts#L12)

## Methods

### close()?

> `optional` **close**(): `void`

Defined in: [types/logger.types.ts:15](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/logger/src/types/logger.types.ts#L15)

#### Returns

`void`

***

### flush()?

> `optional` **flush**(): `Promise`\<`void`\>

Defined in: [types/logger.types.ts:14](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/logger/src/types/logger.types.ts#L14)

#### Returns

`Promise`\<`void`\>

***

### write()

> **write**(`message`, `level?`, `meta?`): `Promise`\<`void`\>

Defined in: [types/logger.types.ts:13](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/logger/src/types/logger.types.ts#L13)

#### Parameters

##### message

`string`

##### level?

[`LogLevel`](../type-aliases/LogLevel.md)

##### meta?

`any`[]

#### Returns

`Promise`\<`void`\>
