# Variable: AbimongoModelRegistry

> `const` **AbimongoModelRegistry**: `object`

Defined in: packages/core/src/utils/ModelRegistry.ts:10

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
