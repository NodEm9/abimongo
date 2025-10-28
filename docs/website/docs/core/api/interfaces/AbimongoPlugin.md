[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoPlugin

# Interface: AbimongoPlugin

Defined in: [packages/core/src/types/abimongoPlugin.type.ts:6](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongoPlugin.type.ts#L6)

Represents a plugin for extending Abimongo functionality.

## Properties

### init()

> **init**: (`schema`) => `void`

Defined in: [packages/core/src/types/abimongoPlugin.type.ts:16](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongoPlugin.type.ts#L16)

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

Defined in: [packages/core/src/types/abimongoPlugin.type.ts:10](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongoPlugin.type.ts#L10)

The name of the plugin.
