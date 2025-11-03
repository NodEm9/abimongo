[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoPlugin

# Interface: AbimongoPlugin

Defined in: [core/src/types/abimongoPlugin.type.ts:6](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/types/abimongoPlugin.type.ts#L6)

Represents a plugin for extending Abimongo functionality.

## Properties

### init()

> **init**: (`schema`) => `void`

Defined in: [core/src/types/abimongoPlugin.type.ts:16](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/types/abimongoPlugin.type.ts#L16)

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

Defined in: [core/src/types/abimongoPlugin.type.ts:10](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/types/abimongoPlugin.type.ts#L10)

The name of the plugin.
