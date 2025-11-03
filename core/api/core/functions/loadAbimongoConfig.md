# Function: loadAbimongoConfig()

> **loadAbimongoConfig**(`configPath?`): `Promise`\<[`AbimongoConfig`](../interfaces/AbimongoConfig.md)\>

Defined in: [core/src/config/loadAbimongoConfig.ts:26](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/config/loadAbimongoConfig.ts#L26)

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
