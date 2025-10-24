# Interface: LoggerHooks

Defined in: types/logger.types.ts:54

## Properties

### onError()?

> `optional` **onError**: (`error`, `entry?`) => `void`

Defined in: types/logger.types.ts:57

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

Defined in: types/logger.types.ts:56

#### Parameters

##### batch

[`LogEntry`](LogEntry.md)[]

#### Returns

`void`

***

### onLog()?

> `optional` **onLog**: (`entry`) => `void`

Defined in: types/logger.types.ts:55

#### Parameters

##### entry

[`LogEntry`](LogEntry.md)

#### Returns

`void`
