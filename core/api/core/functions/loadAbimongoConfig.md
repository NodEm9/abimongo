# Function: loadAbimongoConfig()

> **loadAbimongoConfig**(`configPath?`): `Promise`\<[`AbimongoConfig`](../interfaces/AbimongoConfig.md)\>

Defined in: [core/src/config/loadAbimongoConfig.ts:26](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/config/loadAbimongoConfig.ts#L26)

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
