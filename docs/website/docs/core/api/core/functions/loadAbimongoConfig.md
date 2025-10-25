# Function: loadAbimongoConfig()

> **loadAbimongoConfig**(`configPath?`): `Promise`\<[`AbimongoConfig`](../interfaces/AbimongoConfig.md)\>

Defined in: packages/core/src/config/loadAbimongoConfig.ts:25

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
