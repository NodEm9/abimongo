[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / loadAbimongoConfig

# Function: loadAbimongoConfig()

> **loadAbimongoConfig**(`configPath?`): `Promise`\<[`AbimongoConfig`](../interfaces/AbimongoConfig.md)\>

Defined in: [core/src/config/loadAbimongoConfig.ts:26](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/config/loadAbimongoConfig.ts#L26)

Loads and validates the Abimongo configuration from a JSON file.

## Parameters

### configPath?

`string`

Optional path to the configuration file.

## Returns

`Promise`\<[`AbimongoConfig`](../interfaces/AbimongoConfig.md)\>

- The validated Abimongo configuration.

## Throws

If the config file is not found or is invalid.
