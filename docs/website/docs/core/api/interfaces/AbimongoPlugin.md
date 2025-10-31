[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoPlugin

# Interface: AbimongoPlugin

Defined in: [packages/core/src/types/abimongoPlugin.type.ts:6](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/abimongoPlugin.type.ts#L6)

Represents a plugin for extending Abimongo functionality.

## Properties

### init()

> **init**: (`schema`) => `void`

Defined in: [packages/core/src/types/abimongoPlugin.type.ts:16](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/abimongoPlugin.type.ts#L16)

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

Defined in: [packages/core/src/types/abimongoPlugin.type.ts:10](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/abimongoPlugin.type.ts#L10)

The name of the plugin.
