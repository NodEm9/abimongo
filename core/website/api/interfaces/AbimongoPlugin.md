[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoPlugin

# Interface: AbimongoPlugin

Defined in: [src/types/abimongoPlugin.type.ts:6](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongoPlugin.type.ts#L6)

Represents a plugin for extending Abimongo functionality.

## Properties

### init()

> **init**: (`schema`) => `void`

Defined in: [src/types/abimongoPlugin.type.ts:16](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongoPlugin.type.ts#L16)

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

Defined in: [src/types/abimongoPlugin.type.ts:10](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongoPlugin.type.ts#L10)

The name of the plugin.
