[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoConfig

# Interface: AbimongoConfig

Defined in: [src/types/AbimongoConfig.ts:25](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L25)

## Properties

### advanced?

> `optional` **advanced**: `object`

Defined in: [src/types/AbimongoConfig.ts:54](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L54)

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

> `optional` **retentionPeriod**: `string` \| `number`

#### gcCron?

> `optional` **gcCron**: `string`

***

### features?

> `optional` **features**: `object`

Defined in: [src/types/AbimongoConfig.ts:46](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L46)

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

Defined in: [src/types/AbimongoConfig.ts:40](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L40)

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

Defined in: [src/types/AbimongoConfig.ts:39](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L39)

***

### model?

> `optional` **model**: [`AbimongoModelOptions`](AbimongoModelOptions.md)\<`any`\>

Defined in: [src/types/AbimongoConfig.ts:28](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L28)

***

### mongoUri?

> `optional` **mongoUri**: `string`

Defined in: [src/types/AbimongoConfig.ts:27](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L27)

***

### multiTenant?

> `optional` **multiTenant**: `object`

Defined in: [src/types/AbimongoConfig.ts:30](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L30)

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

Defined in: [src/types/AbimongoConfig.ts:26](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L26)

***

### schema?

> `optional` **schema**: [`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<[`Document`](../type-aliases/Document.md)\>

Defined in: [src/types/AbimongoConfig.ts:29](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L29)
