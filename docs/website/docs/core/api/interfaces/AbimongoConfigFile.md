[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoConfigFile

# Interface: AbimongoConfigFile

Defined in: [core/src/types/AbimongoConfig.ts:71](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/types/AbimongoConfig.ts#L71)

## Properties

### advanced?

> `optional` **advanced**: `object`

Defined in: [core/src/types/AbimongoConfig.ts:78](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/types/AbimongoConfig.ts#L78)

#### autoInstall?

> `optional` **autoInstall**: `boolean`

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

Defined in: [core/src/types/AbimongoConfig.ts:77](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/types/AbimongoConfig.ts#L77)

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

Defined in: [core/src/types/AbimongoConfig.ts:76](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/types/AbimongoConfig.ts#L76)

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

Defined in: [core/src/types/AbimongoConfig.ts:75](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/types/AbimongoConfig.ts#L75)

***

### mongoUri

> **mongoUri**: `string`

Defined in: [core/src/types/AbimongoConfig.ts:73](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/types/AbimongoConfig.ts#L73)

***

### multiTenant?

> `optional` **multiTenant**: `object`

Defined in: [core/src/types/AbimongoConfig.ts:74](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/types/AbimongoConfig.ts#L74)

#### enabled?

> `optional` **enabled**: `boolean`

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

Defined in: [core/src/types/AbimongoConfig.ts:72](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/types/AbimongoConfig.ts#L72)
