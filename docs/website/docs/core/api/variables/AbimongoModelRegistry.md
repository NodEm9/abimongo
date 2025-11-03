[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoModelRegistry

# Variable: AbimongoModelRegistry

> `const` **AbimongoModelRegistry**: `object`

Defined in: [core/src/utils/ModelRegistry.ts:9](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/utils/ModelRegistry.ts#L9)

AbimongoModelRegistry is a utility to register and manage Abimongo models.
It allows you to register models and retrieve all registered models.

## Type Declaration

### getAllModels()

> **getAllModels**(): [`AbimongoModel`](../classes/AbimongoModel.md)\<`any`\>[]

Retrieves all registered models.

#### Returns

[`AbimongoModel`](../classes/AbimongoModel.md)\<`any`\>[]

An array of all registered models.

### getRegisteredModel()

> **getRegisteredModel**(`model`): [`AbimongoModel`](../classes/AbimongoModel.md)\<`any`\> \| `null`

Retrieves a registered model if it exists in the registry.

#### Parameters

##### model

[`AbimongoModel`](../classes/AbimongoModel.md)\<`any`\>

The model to retrieve.

#### Returns

[`AbimongoModel`](../classes/AbimongoModel.md)\<`any`\> \| `null`

The registered model or null if not found.

### isModelRegistered()

> **isModelRegistered**(`model`): `boolean`

Checks if a model is registered.

#### Parameters

##### model

[`AbimongoModel`](../classes/AbimongoModel.md)\<`any`\>

The model to check.

#### Returns

`boolean`

True if the model is registered, false otherwise.

### registerModel()

> **registerModel**(`model`): `void`

Registers a model in the registry.

#### Parameters

##### model

[`AbimongoModel`](../classes/AbimongoModel.md)\<`any`\>

The model to register.

#### Returns

`void`

### unregisterModel()

> **unregisterModel**(`model`): `void`

Unregisters a model from the registry.

#### Parameters

##### model

[`AbimongoModel`](../classes/AbimongoModel.md)\<`any`\>

The model to unregister.

#### Returns

`void`
