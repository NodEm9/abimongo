[**@abimongo/logger**](../README.md)

***

# Function: shouldLog()

> **shouldLog**(`level`, `configLevel`): `boolean`

Defined in: [logger/levels.ts:19](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/logger/levels.ts#L19)

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
