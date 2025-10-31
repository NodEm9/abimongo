[**@abimongo/logger**](../README.md)

***

# Interface: Transporter

Defined in: [types/logger.types.ts:12](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/types/logger.types.ts#L12)

## Methods

### close()?

> `optional` **close**(): `void`

Defined in: [types/logger.types.ts:15](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/types/logger.types.ts#L15)

#### Returns

`void`

***

### flush()?

> `optional` **flush**(): `Promise`\<`void`\>

Defined in: [types/logger.types.ts:14](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/types/logger.types.ts#L14)

#### Returns

`Promise`\<`void`\>

***

### write()

> **write**(`message`, `level?`, `meta?`): `Promise`\<`void`\>

Defined in: [types/logger.types.ts:13](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/types/logger.types.ts#L13)

#### Parameters

##### message

`string`

##### level?

[`LogLevel`](../type-aliases/LogLevel.md)

##### meta?

`any`[]

#### Returns

`Promise`\<`void`\>
