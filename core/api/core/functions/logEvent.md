# Function: logEvent()

> **logEvent**(`logger`, `eventType`, `message?`, `level?`, `context?`): `void`

Defined in: [core/src/utils/eventOptions.ts:101](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/utils/eventOptions.ts#L101)

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
