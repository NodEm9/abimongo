[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoModelRegistry

# Variable: AbimongoModelRegistry

> `const` **AbimongoModelRegistry**: `object`

Defined in: [src/utils/ModelRegistry.ts:10](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/utils/ModelRegistry.ts#L10)

AbimongoModelRegistry is a utility to register and manage Abimongo models.
It allows you to register models and retrieve all registered models.

## Type declaration

### getAllModels()

> **getAllModels**(): [`AbimongoModel`](../classes/AbimongoModel.md)\<`any`\>[]

Retrieves all registered models.

#### Returns

[`AbimongoModel`](../classes/AbimongoModel.md)\<`any`\>[]

An array of all registered models.

### getRegisteredModel()

> **getRegisteredModel**(`model`): `null` \| [`AbimongoModel`](../classes/AbimongoModel.md)\<`any`\>

Retrieves a registered model if it exists in the registry.

#### Parameters

##### model

[`AbimongoModel`](../classes/AbimongoModel.md)\<`any`\>

The model to retrieve.

#### Returns

`null` \| [`AbimongoModel`](../classes/AbimongoModel.md)\<`any`\>

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
