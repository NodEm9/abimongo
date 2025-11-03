# Interface: AsyncBatchTransporterOptions

Defined in: [types/logger.types.ts:48](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/logger/src/types/logger.types.ts#L48)

## Properties

### batchSize?

> `optional` **batchSize**: `number`

Defined in: [types/logger.types.ts:49](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/logger/src/types/logger.types.ts#L49)

***

### flushInterval?

> `optional` **flushInterval**: `number`

Defined in: [types/logger.types.ts:50](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/logger/src/types/logger.types.ts#L50)

***

### sendBatch()

> **sendBatch**: (`entries`) => `Promise`\<`void`\>

Defined in: [types/logger.types.ts:51](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/logger/src/types/logger.types.ts#L51)

#### Parameters

##### entries

[`LogEntry`](LogEntry.md)[]

#### Returns

`Promise`\<`void`\>
