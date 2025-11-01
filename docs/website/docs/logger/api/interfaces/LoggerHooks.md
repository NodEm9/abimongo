[**@abimongo/logger**](../README.md)

***

# Interface: LoggerHooks

Defined in: [types/logger.types.ts:54](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/types/logger.types.ts#L54)

## Properties

### onError()?

> `optional` **onError**: (`error`, `entry?`) => `void`

Defined in: [types/logger.types.ts:57](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/types/logger.types.ts#L57)

#### Parameters

##### error

`any`

##### entry?

[`LogEntry`](LogEntry.md) | [`LogEntry`](LogEntry.md)[]

#### Returns

`void`

***

### onFlush()?

> `optional` **onFlush**: (`batch`) => `void`

Defined in: [types/logger.types.ts:56](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/types/logger.types.ts#L56)

#### Parameters

##### batch

[`LogEntry`](LogEntry.md)[]

#### Returns

`void`

***

### onLog()?

> `optional` **onLog**: (`entry`) => `void`

Defined in: [types/logger.types.ts:55](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/types/logger.types.ts#L55)

#### Parameters

##### entry

[`LogEntry`](LogEntry.md)

#### Returns

`void`
