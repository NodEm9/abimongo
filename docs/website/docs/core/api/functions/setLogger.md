[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / setLogger

# Function: setLogger()

> **setLogger**(`loggerConfig`): `ILogger`

Defined in: [core/src/utils/logger.ts:9](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/utils/logger.ts#L9)

Initialize and return the project logger.
This function is defensive about the shape of the passed config so callers
can pass booleans or partial objects without causing runtime errors.

## Parameters

### loggerConfig

`Partial`\<[`AbimongoLoggerSettings`](../interfaces/AbimongoLoggerSettings.md) & `object` \| `undefined`\> = `{}`

## Returns

`ILogger`
