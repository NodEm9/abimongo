# Interface: AbimongoPlugin

Defined in: [core/src/types/abimongoPlugin.type.ts:6](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/types/abimongoPlugin.type.ts#L6)

Represents a plugin for extending Abimongo functionality.

## Properties

### init()

> **init**: (`schema`) => `void`

Defined in: [core/src/types/abimongoPlugin.type.ts:16](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/types/abimongoPlugin.type.ts#L16)

The initialization function for the plugin.

#### Parameters

##### schema

[`AbimongoSchema`](../classes/AbimongoSchema.md)\<`any`\>

The schema to initialize the plugin with.

#### Returns

`void`

***

### name

> **name**: `string`

Defined in: [core/src/types/abimongoPlugin.type.ts:10](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/types/abimongoPlugin.type.ts#L10)

The name of the plugin.
