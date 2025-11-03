# Function: shouldLog()

> **shouldLog**(`level`, `configLevel`): `boolean`

Defined in: [logger/levels.ts:19](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/logger/src/logger/levels.ts#L19)

Determines if a message at a given log level should be logged based on the current configuration level.

## Parameters

### level

[`LogLevel`](../type-aliases/LogLevel.md)

The log level of the message.

### configLevel

[`LogLevel`](../type-aliases/LogLevel.md)

The configured log level.

## Returns

`boolean`

True if the message should be logged, false otherwise.
