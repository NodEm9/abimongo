[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / logEvent

# Function: logEvent()

> **logEvent**(`logger`, `eventType`, `message?`, `level?`, `context?`): `void`

Defined in: [packages/core/src/utils/eventOptions.ts:101](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/utils/eventOptions.ts#L101)

Logs the event action using a provided logger.

## Parameters

### logger

`any`

The logger instance (must have a log method).

### eventType

[`EventType`](../type-aliases/EventType.md)

The type of the event.

### message?

`string`

Optional custom message.

### level?

`string` = `'info'`

Log level (default: 'info').

### context?

`any`

Optional context or payload to log.

## Returns

`void`
