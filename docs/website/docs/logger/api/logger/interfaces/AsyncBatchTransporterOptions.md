# Interface: AsyncBatchTransporterOptions

Defined in: types/logger.types.ts:48

## Properties

### batchSize?

> `optional` **batchSize**: `number`

Defined in: types/logger.types.ts:49

***

### flushInterval?

> `optional` **flushInterval**: `number`

Defined in: types/logger.types.ts:50

***

### sendBatch()

> **sendBatch**: (`entries`) => `Promise`\<`void`\>

Defined in: types/logger.types.ts:51

#### Parameters

##### entries

[`LogEntry`](LogEntry.md)[]

#### Returns

`Promise`\<`void`\>
