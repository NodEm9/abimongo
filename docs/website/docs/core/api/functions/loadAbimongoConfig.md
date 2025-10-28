[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / loadAbimongoConfig

# Function: loadAbimongoConfig()

> **loadAbimongoConfig**(`configPath?`): `Promise`\<[`AbimongoConfig`](../interfaces/AbimongoConfig.md)\>

Defined in: [packages/core/src/config/loadAbimongoConfig.ts:26](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/config/loadAbimongoConfig.ts#L26)

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
