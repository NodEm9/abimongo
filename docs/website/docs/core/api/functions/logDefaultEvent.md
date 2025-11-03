[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / logDefaultEvent

# Function: logDefaultEvent()

> **logDefaultEvent**(`eventType`, `message?`, `level?`, `context?`): [`EventType`](../type-aliases/EventType.md)

Defined in: [core/src/utils/eventOptions.ts:142](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/utils/eventOptions.ts#L142)

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
