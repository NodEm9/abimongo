[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoSchema

# Class: AbimongoSchema\<T\>

Defined in: [src/core/AbimongoSchema.ts:16](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L16)

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

Defined in: [src/core/AbimongoSchema.ts:30](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L30)

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

Defined in: [src/core/AbimongoSchema.ts:129](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L129)

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

Defined in: [src/core/AbimongoSchema.ts:90](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L90)

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

Defined in: [src/core/AbimongoSchema.ts:79](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L79)

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

Defined in: [src/core/AbimongoSchema.ts:115](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L115)

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

Defined in: [src/core/AbimongoSchema.ts:140](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L140)

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

> **getGCConfig**(): `undefined` \| [`GCConfig`](../type-aliases/GCConfig.md)

Defined in: [src/core/AbimongoSchema.ts:209](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L209)

#### Returns

`undefined` \| [`GCConfig`](../type-aliases/GCConfig.md)

***

### getHooks()

> **getHooks**(`action`): [`HookFunction`](../type-aliases/HookFunction.md)[]

Defined in: [src/core/AbimongoSchema.ts:165](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L165)

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

Defined in: [src/core/AbimongoSchema.ts:98](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L98)

Retrieves all relationships defined in the schema.

#### Returns

[`Relationship`](../interfaces/Relationship.md)\<`any`\>[]

An array of relationships.

***

### getSchema()

> **getSchema**(): [`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<`T`\>

Defined in: [src/core/AbimongoSchema.ts:38](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L38)

Retrieves the schema definition.

#### Returns

[`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<`T`\>

The schema definition.

***

### index()

> **index**(`fields`, `options?`): `void`

Defined in: [src/core/AbimongoSchema.ts:70](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L70)

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

Defined in: [src/core/AbimongoSchema.ts:174](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L174)

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

Defined in: [src/core/AbimongoSchema.ts:153](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L153)

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

Defined in: [src/core/AbimongoSchema.ts:199](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L199)

#### Parameters

##### schemaDefinition

[`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<`T`\>

#### Returns

`void`

***

### setGCConfig()

> **setGCConfig**(`config`): `this`

Defined in: [src/core/AbimongoSchema.ts:204](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L204)

#### Parameters

##### config

[`GCConfig`](../type-aliases/GCConfig.md)

#### Returns

`this`

***

### triggerMiddleware()

> **triggerMiddleware**(`action`, `data`): `Promise`\<`void`\>

Defined in: [src/core/AbimongoSchema.ts:187](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L187)

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

Defined in: [src/core/AbimongoSchema.ts:56](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L56)

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

Defined in: [src/core/AbimongoSchema.ts:47](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L47)

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

Defined in: [src/core/AbimongoSchema.ts:107](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoSchema.ts#L107)

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
