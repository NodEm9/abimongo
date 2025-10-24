# Function: logEvent()

> **logEvent**(`logger`, `eventType`, `message?`, `level?`, `context?`): `void`

Defined in: packages/core/src/utils/eventOptions.ts:101

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
