[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / logEvent

# Function: logEvent()

> **logEvent**(`logger`, `eventType`, `message?`, `level?`, `context?`): `void`

Defined in: [src/utils/eventOptions.ts:100](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/utils/eventOptions.ts#L100)

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
