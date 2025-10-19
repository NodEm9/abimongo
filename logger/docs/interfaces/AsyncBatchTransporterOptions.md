[**@abimongo_utils/logger v1.4.6**](../README.md)

***

[@abimongo_utils/logger](../README.md) / AsyncBatchTransporterOptions

# Interface: AsyncBatchTransporterOptions

Defined in: [types/logger.types.ts:48](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/types/logger.types.ts#L48)

## Properties

### batchSize?

> `optional` **batchSize**: `number`

Defined in: [types/logger.types.ts:49](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/types/logger.types.ts#L49)

***

### flushInterval?

> `optional` **flushInterval**: `number`

Defined in: [types/logger.types.ts:50](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/types/logger.types.ts#L50)

***

### sendBatch()

> **sendBatch**: (`entries`) => `Promise`\<`void`\>

Defined in: [types/logger.types.ts:51](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/types/logger.types.ts#L51)

#### Parameters

##### entries

[`LogEntry`](LogEntry.md)[]

#### Returns

`Promise`\<`void`\>
