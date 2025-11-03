[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / setLogger

# Function: setLogger()

> **setLogger**(`loggerConfig`): `ILogger`

Defined in: [core/src/utils/logger.ts:9](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/utils/logger.ts#L9)

Initialize and return the project logger.
This function is defensive about the shape of the passed config so callers
can pass booleans or partial objects without causing runtime errors.

## Parameters

### loggerConfig

`Partial`\<[`AbimongoLoggerSettings`](../interfaces/AbimongoLoggerSettings.md) & `object` \| `undefined`\> = `{}`

## Returns

`ILogger`
