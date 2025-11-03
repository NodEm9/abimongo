# Class: AbimongoSchema\<T\>

Defined in: [core/src/lib-core/AbimongoSchema.ts:15](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L15)

The AbimongoSchema class allows you to define a schema for your MongoDB documents, including custom validation, indexing, and relationships between collections.
It also supports hooks for pre- and post-processing of documents, as well as virtual fields

## Extended by

- [`Schema`](Schema.md)

## Type Parameters

### T

`T` *extends* [`Document`](../type-aliases/Document.md)

## Constructors

### Constructor

> **new AbimongoSchema**\<`T`\>(`schemaDefinition`): `AbimongoSchema`\<`T`\>

Defined in: [core/src/lib-core/AbimongoSchema.ts:29](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L29)

Creates an instance of AbimongoSchema.

#### Parameters

##### schemaDefinition

[`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<`T`\>

The schema definition for the document.

#### Returns

`AbimongoSchema`\<`T`\>

## Methods

### addHook()

> **addHook**(`event`, `fn`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:128](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L128)

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

***

### addRelationship()

> **addRelationship**(`ref`, `localField`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:89](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L89)

Adds a relationship to the schema.

#### Parameters

##### ref

`string`

The name of the referenced collection.

##### localField

keyof `T`

The field in the current document that holds the reference.

#### Returns

`void`

***

### applyIndexes()

> **applyIndexes**(`collection`): `Promise`\<`void`\>

Defined in: [core/src/lib-core/AbimongoSchema.ts:78](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L78)

Applies all defined indexes to a MongoDB collection.

#### Parameters

##### collection

`Collection`\<`any`\>

The MongoDB collection to apply indexes to.

#### Returns

`Promise`\<`void`\>

Resolves when all indexes are applied.

***

### applyVirtuals()

> **applyVirtuals**(`doc`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:114](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L114)

Applies all virtual fields to a document.

#### Parameters

##### doc

`any`

The document to apply virtual fields to.

#### Returns

`void`

***

### executeHooks()

> **executeHooks**(`event`, `data`): `Promise`\<`void`\>

Defined in: [core/src/lib-core/AbimongoSchema.ts:139](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L139)

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

***

### getGCConfig()

> **getGCConfig**(): [`GCConfig`](../type-aliases/GCConfig.md) \| `undefined`

Defined in: [core/src/lib-core/AbimongoSchema.ts:208](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L208)

#### Returns

[`GCConfig`](../type-aliases/GCConfig.md) \| `undefined`

***

### getHooks()

> **getHooks**(`action`): [`HookFunction`](../type-aliases/HookFunction.md)[]

Defined in: [core/src/lib-core/AbimongoSchema.ts:164](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L164)

Retrieves all hooks for a specific action.

#### Parameters

##### action

`string`

The action name.

#### Returns

[`HookFunction`](../type-aliases/HookFunction.md)[]

An array of hook functions.

***

### getRelationships()

> **getRelationships**(): [`Relationship`](../interfaces/Relationship.md)\<`any`\>[]

Defined in: [core/src/lib-core/AbimongoSchema.ts:97](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L97)

Retrieves all relationships defined in the schema.

#### Returns

[`Relationship`](../interfaces/Relationship.md)\<`any`\>[]

An array of relationships.

***

### getSchema()

> **getSchema**(): [`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<`T`\>

Defined in: [core/src/lib-core/AbimongoSchema.ts:37](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L37)

Retrieves the schema definition.

#### Returns

[`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<`T`\>

The schema definition.

***

### index()

> **index**(`fields`, `options?`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:69](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L69)

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

***

### post()

> **post**(`action`, `fn`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:173](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L173)

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

***

### pre()

> **pre**(`action`, `fn`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:152](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L152)

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

***

### registerSchema()

> **registerSchema**(`schemaDefinition`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:198](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L198)

#### Parameters

##### schemaDefinition

[`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<`T`\>

#### Returns

`void`

***

### setGCConfig()

> **setGCConfig**(`config`): `this`

Defined in: [core/src/lib-core/AbimongoSchema.ts:203](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L203)

#### Parameters

##### config

[`GCConfig`](../type-aliases/GCConfig.md)

#### Returns

`this`

***

### triggerMiddleware()

> **triggerMiddleware**(`action`, `data`): `Promise`\<`void`\>

Defined in: [core/src/lib-core/AbimongoSchema.ts:186](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L186)

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

***

### validate()

> **validate**(`doc`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:55](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L55)

Validates a document against the schema's custom validators.

#### Parameters

##### doc

`OptionalUnlessRequiredId`\<`T`\>

The document to validate.

#### Returns

`void`

#### Throws

If validation fails for any field.

***

### validator()

> **validator**(`field`, `fn`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:46](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L46)

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

***

### virtual()

> **virtual**(`name`, `getter`): `void`

Defined in: [core/src/lib-core/AbimongoSchema.ts:106](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/lib-core/AbimongoSchema.ts#L106)

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
