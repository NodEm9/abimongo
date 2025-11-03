# Function: setLogger()

> **setLogger**(`loggerConfig`): `ILogger`

Defined in: [core/src/utils/logger.ts:9](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/utils/logger.ts#L9)

Initialize and return the project logger.
This function is defensive about the shape of the passed config so callers
can pass booleans or partial objects without causing runtime errors.

## Parameters

### loggerConfig

`Partial`\<[`AbimongoLoggerSettings`](../interfaces/AbimongoLoggerSettings.md) & `object` \| `undefined`\> = `{}`

## Returns

`ILogger`
