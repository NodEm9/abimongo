[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / ProjectOptions

# Interface: ProjectOptions

Defined in: [src/types/AbimongoConfig.ts:78](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L78)

## Properties

### advanced?

> `optional` **advanced**: `object`

Defined in: [src/types/AbimongoConfig.ts:107](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L107)

#### circuitBreaker?

> `optional` **circuitBreaker**: `object`

##### circuitBreaker.enabled?

> `optional` **enabled**: `boolean`

##### circuitBreaker.retryAttempts?

> `optional` **retryAttempts**: `number`

#### garbageCollector?

> `optional` **garbageCollector**: `object`

##### garbageCollector.enabled?

> `optional` **enabled**: `boolean`

##### garbageCollector.logResults?

> `optional` **logResults**: `boolean`

##### garbageCollector.retentionPeriod?

> `optional` **retentionPeriod**: `number`

#### gcCron?

> `optional` **gcCron**: `string`

***

### features?

> `optional` **features**: `object`

Defined in: [src/types/AbimongoConfig.ts:99](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L99)

#### models?

> `optional` **models**: `string`

#### redisUri?

> `optional` **redisUri**: `string`

#### resolvers?

> `optional` **resolvers**: `string`

#### schemas?

> `optional` **schemas**: `string`

#### typeDefs?

> `optional` **typeDefs**: `string`

#### useRedisCache?

> `optional` **useRedisCache**: `boolean`

***

### graphql?

> `optional` **graphql**: `object`

Defined in: [src/types/AbimongoConfig.ts:93](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L93)

#### enabled?

> `optional` **enabled**: `boolean`

#### playground?

> `optional` **playground**: `boolean`

#### schemaOutputPath?

> `optional` **schemaOutputPath**: `string`

#### subscriptions?

> `optional` **subscriptions**: `boolean`

***

### logger?

> `optional` **logger**: [`AbimongoLoggerSettings`](AbimongoLoggerSettings.md)

Defined in: [src/types/AbimongoConfig.ts:92](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L92)

***

### model?

> `optional` **model**: [`AbimongoModelOptions`](AbimongoModelOptions.md)\<`any`\>

Defined in: [src/types/AbimongoConfig.ts:81](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L81)

***

### mongoUri?

> `optional` **mongoUri**: `string`

Defined in: [src/types/AbimongoConfig.ts:80](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L80)

***

### multiTenant?

> `optional` **multiTenant**: `object`

Defined in: [src/types/AbimongoConfig.ts:83](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L83)

#### enabled?

> `optional` **enabled**: `true`

#### headerKey?

> `optional` **headerKey**: `"x-tenant-id"`

#### initOptions?

> `optional` **initOptions**: [`InitMultiTenancyOptions`](InitMultiTenancyOptions.md)

#### tenants?

> `optional` **tenants**: `object`

##### tenants.tenant-a

> **tenant-a**: `"mongodb://localhost:27017/tenant-a"`

##### tenants.tenant-b

> **tenant-b**: `"mongodb://localhost:27017/tenant-b"`

***

### projectName?

> `optional` **projectName**: `string`

Defined in: [src/types/AbimongoConfig.ts:79](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L79)

***

### schema?

> `optional` **schema**: [`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<[`Document`](../type-aliases/Document.md)\>

Defined in: [src/types/AbimongoConfig.ts:82](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L82)
