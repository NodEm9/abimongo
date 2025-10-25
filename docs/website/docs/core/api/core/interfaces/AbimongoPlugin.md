# Interface: AbimongoPlugin

Defined in: packages/core/src/types/abimongoPlugin.type.ts:6

Represents a plugin for extending Abimongo functionality.

## Properties

### init()

> **init**: (`schema`) => `void`

Defined in: packages/core/src/types/abimongoPlugin.type.ts:16

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

Defined in: packages/core/src/types/abimongoPlugin.type.ts:10

The name of the plugin.
