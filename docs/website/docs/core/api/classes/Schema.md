[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / Schema

# Class: Schema

Defined in: [core/src/lib-core/AbimongoSchema.ts:216](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L216)

The AbimongoSchema class allows you to define a schema for your MongoDB documents, including custom validation, indexing, and relationships between collections.
It also supports hooks for pre- and post-processing of documents, as well as virtual fields

## Extends

- [`AbimongoSchema`](AbimongoSchema.md)\<[`Document`](../type-aliases/Document.md)\>

## Constructors

### Constructor

> **new Schema**(`schemaDefinition`): `Schema`

Defined in: [core/src/lib-core/AbimongoSchema.ts:217](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L217)

#### Parameters

##### schemaDefinition

[`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<[`Document`](../type-aliases/Document.md)\>

#### Returns

`Schema`

#### Overrides

[`AbimongoSchema`](AbimongoSchema.md).[`constructor`](AbimongoSchema.md#constructor)

## Methods

### addHook()

> **addHook**(`event`, `fn`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:128](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L128)

Adds a hook to be executed for a specific event.

#### Parameters

##### event

`string`

The event name (e.g., "save", "delete").

##### fn

[`HookFunction`](../type-aliases/HookFunction.md)

The hook function to execute.

#### Returns

`void`

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`addHook`](AbimongoSchema.md#addhook)

***

### addRelationship()

> **addRelationship**(`ref`, `localField`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:89](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L89)

Adds a relationship to the schema.

#### Parameters

##### ref

`string`

The name of the referenced collection.

##### localField

The field in the current document that holds the reference.

`string` | `number`

#### Returns

`void`

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`addRelationship`](AbimongoSchema.md#addrelationship)

***

### applyIndexes()

> **applyIndexes**(`collection`): `Promise`\<`void`\>

Defined in: [core/src/lib-core/AbimongoSchema.ts:78](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L78)

Applies all defined indexes to a MongoDB collection.

#### Parameters

##### collection

`Collection`\<`any`\>

The MongoDB collection to apply indexes to.

#### Returns

`Promise`\<`void`\>

Resolves when all indexes are applied.

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`applyIndexes`](AbimongoSchema.md#applyindexes)

***

### applyVirtuals()

> **applyVirtuals**(`doc`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:114](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L114)

Applies all virtual fields to a document.

#### Parameters

##### doc

`any`

The document to apply virtual fields to.

#### Returns

`void`

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`applyVirtuals`](AbimongoSchema.md#applyvirtuals)

***

### create()

> **create**(`data`): `Promise`\<[`Document`](../type-aliases/Document.md)\>

Defined in: [core/src/lib-core/AbimongoSchema.ts:223](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L223)

#### Parameters

##### data

`OptionalId`\<[`Document`](../type-aliases/Document.md)\>

#### Returns

`Promise`\<[`Document`](../type-aliases/Document.md)\>

***

### executeHooks()

> **executeHooks**(`event`, `data`): `Promise`\<`void`\>

Defined in: [core/src/lib-core/AbimongoSchema.ts:139](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L139)

Executes all hooks for a specific event.

#### Parameters

##### event

`string`

The event name.

##### data

`any`

The data to pass to the hook functions.

#### Returns

`Promise`\<`void`\>

Resolves when all hooks are executed.

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`executeHooks`](AbimongoSchema.md#executehooks)

***

### getGCConfig()

> **getGCConfig**(): [`GCConfig`](../type-aliases/GCConfig.md) \| `undefined`

Defined in: [core/src/lib-core/AbimongoSchema.ts:208](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L208)

#### Returns

[`GCConfig`](../type-aliases/GCConfig.md) \| `undefined`

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`getGCConfig`](AbimongoSchema.md#getgcconfig)

***

### getHooks()

> **getHooks**(`action`): [`HookFunction`](../type-aliases/HookFunction.md)[]

Defined in: [core/src/lib-core/AbimongoSchema.ts:164](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L164)

Retrieves all hooks for a specific action.

#### Parameters

##### action

`string`

The action name.

#### Returns

[`HookFunction`](../type-aliases/HookFunction.md)[]

An array of hook functions.

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`getHooks`](AbimongoSchema.md#gethooks)

***

### getRelationships()

> **getRelationships**(): [`Relationship`](../interfaces/Relationship.md)\<`any`\>[]

Defined in: [core/src/lib-core/AbimongoSchema.ts:97](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L97)

Retrieves all relationships defined in the schema.

#### Returns

[`Relationship`](../interfaces/Relationship.md)\<`any`\>[]

An array of relationships.

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`getRelationships`](AbimongoSchema.md#getrelationships)

***

### getSchema()

> **getSchema**(): [`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<[`Document`](../type-aliases/Document.md)\>

Defined in: [core/src/lib-core/AbimongoSchema.ts:37](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L37)

Retrieves the schema definition.

#### Returns

[`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<[`Document`](../type-aliases/Document.md)\>

The schema definition.

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`getSchema`](AbimongoSchema.md#getschema)

***

### index()

> **index**(`fields`, `options?`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:69](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L69)

Adds an index to the schema.

#### Parameters

##### fields

`any`

The fields to index.

##### options?

`any`

Optional index options.

#### Returns

`void`

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`index`](AbimongoSchema.md#index)

***

### post()

> **post**(`action`, `fn`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:173](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L173)

Adds a post-hook for a specific action.

#### Parameters

##### action

`string`

The action name (e.g., "save", "delete").

##### fn

[`HookFunction`](../type-aliases/HookFunction.md)

The hook function to execute after the action.

#### Returns

`void`

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`post`](AbimongoSchema.md#post)

***

### pre()

> **pre**(`action`, `fn`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:152](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L152)

Adds a pre-hook for a specific action.

#### Parameters

##### action

`string`

The action name (e.g., "save", "delete").

##### fn

[`HookFunction`](../type-aliases/HookFunction.md)

The hook function to execute before the action.

#### Returns

`void`

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`pre`](AbimongoSchema.md#pre)

***

### registerSchema()

> **registerSchema**(`schemaDefinition`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:198](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L198)

#### Parameters

##### schemaDefinition

[`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<[`Document`](../type-aliases/Document.md)\>

#### Returns

`void`

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`registerSchema`](AbimongoSchema.md#registerschema)

***

### setGCConfig()

> **setGCConfig**(`config`): `this`

Defined in: [core/src/lib-core/AbimongoSchema.ts:203](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L203)

#### Parameters

##### config

[`GCConfig`](../type-aliases/GCConfig.md)

#### Returns

`this`

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`setGCConfig`](AbimongoSchema.md#setgcconfig)

***

### triggerMiddleware()

> **triggerMiddleware**(`action`, `data`): `Promise`\<`void`\>

Defined in: [core/src/lib-core/AbimongoSchema.ts:186](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L186)

Triggers middleware for a specific action.

#### Parameters

##### action

`string`

The action name.

##### data

`any`

The data to pass to the middleware functions.

#### Returns

`Promise`\<`void`\>

Resolves when all middleware functions are executed.

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`triggerMiddleware`](AbimongoSchema.md#triggermiddleware)

***

### validate()

> **validate**(`doc`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:55](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L55)

Validates a document against the schema's custom validators.

#### Parameters

##### doc

`OptionalId`\<[`Document`](../type-aliases/Document.md)\>

The document to validate.

#### Returns

`void`

#### Throws

If validation fails for any field.

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`validate`](AbimongoSchema.md#validate)

***

### validator()

> **validator**(`field`, `fn`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:46](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L46)

Adds a custom validator for a specific field.

#### Parameters

##### field

`string`

The field to validate.

##### fn

(`value`) => `boolean`

The validation function.

#### Returns

`void`

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`validator`](AbimongoSchema.md#validator)

***

### virtual()

> **virtual**(`name`, `getter`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:106](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L106)

Adds a virtual field to the schema.

#### Parameters

##### name

`string`

The name of the virtual field.

##### getter

(`doc`) => `any`

The function to compute the virtual field's value.

#### Returns

`void`

#### Inherited from

[`AbimongoSchema`](AbimongoSchema.md).[`virtual`](AbimongoSchema.md#virtual)

***

### create()

> `static` **create**\<`T`\>(`schemaDefinition`): `Schema`

Defined in: [core/src/lib-core/AbimongoSchema.ts:238](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/AbimongoSchema.ts#L238)

#### Type Parameters

##### T

`T` *extends* [`Document`](../type-aliases/Document.md)

#### Parameters

##### schemaDefinition

[`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<`T`\>

#### Returns

`Schema`
