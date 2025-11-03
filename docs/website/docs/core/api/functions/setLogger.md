[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / setLogger

# Function: setLogger()

> **setLogger**(`loggerConfig`): `ILogger`

Defined in: [core/src/utils/logger.ts:9](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/utils/logger.ts#L9)

Initialize and return the project logger.
This function is defensive about the shape of the passed config so callers
can pass booleans or partial objects without causing runtime errors.

## Parameters

### loggerConfig

`Partial`\<[`AbimongoLoggerSettings`](../interfaces/AbimongoLoggerSettings.md) & `object` \| `undefined`\> = `{}`

## Returns

`ILogger`
