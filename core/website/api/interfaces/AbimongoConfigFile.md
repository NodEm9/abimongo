[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoConfigFile

# Interface: AbimongoConfigFile

Defined in: [src/types/AbimongoConfig.ts:68](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L68)

## Properties

### advanced?

> `optional` **advanced**: `object`

Defined in: [src/types/AbimongoConfig.ts:75](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L75)

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

Defined in: [src/types/AbimongoConfig.ts:74](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L74)

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

Defined in: [src/types/AbimongoConfig.ts:73](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L73)

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

Defined in: [src/types/AbimongoConfig.ts:72](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L72)

***

### mongoUri

> **mongoUri**: `string`

Defined in: [src/types/AbimongoConfig.ts:70](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L70)

***

### multiTenant?

> `optional` **multiTenant**: `object`

Defined in: [src/types/AbimongoConfig.ts:71](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L71)

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

Defined in: [src/types/AbimongoConfig.ts:69](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/AbimongoConfig.ts#L69)
