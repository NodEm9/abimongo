[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / logDefaultEvent

# Function: logDefaultEvent()

> **logDefaultEvent**(`eventType`, `message?`, `level?`, `context?`): [`EventType`](../type-aliases/EventType.md)

Defined in: [src/utils/eventOptions.ts:121](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/utils/eventOptions.ts#L121)

Logs an event with a default logger.

## Parameters

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

[`EventType`](../type-aliases/EventType.md)
