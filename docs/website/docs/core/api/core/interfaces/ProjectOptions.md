# Interface: ProjectOptions

Defined in: packages/core/src/types/AbimongoConfig.ts:80

## Properties

### advanced?

> `optional` **advanced**: `object`

Defined in: packages/core/src/types/AbimongoConfig.ts:116

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

> `optional` **logResults**: `false`

##### garbageCollector.retentionPeriod?

> `optional` **retentionPeriod**: `number`

#### gcCron?

> `optional` **gcCron**: `string`

***

### compressLogFiles?

> `optional` **compressLogFiles**: `object`

Defined in: packages/core/src/types/AbimongoConfig.ts:109

#### enabled?

> `optional` **enabled**: `boolean`

***

### enableMetrics?

> `optional` **enableMetrics**: `object`

Defined in: packages/core/src/types/AbimongoConfig.ts:112

#### enabled?

> `optional` **enabled**: `boolean`

#### logInterval?

> `optional` **logInterval**: `number`

***

### features?

> `optional` **features**: `object`

Defined in: packages/core/src/types/AbimongoConfig.ts:101

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

Defined in: packages/core/src/types/AbimongoConfig.ts:95

#### enabled?

> `optional` **enabled**: `boolean`

#### playground?

> `optional` **playground**: `false`

#### schemaOutputPath?

> `optional` **schemaOutputPath**: `string`

#### subscriptions?

> `optional` **subscriptions**: `true`

***

### model?

> `optional` **model**: [`AbimongoModelOptions`](AbimongoModelOptions.md)\<`any`\>

Defined in: packages/core/src/types/AbimongoConfig.ts:83

***

### mongoUri?

> `optional` **mongoUri**: `string`

Defined in: packages/core/src/types/AbimongoConfig.ts:82

***

### multiTenant?

> `optional` **multiTenant**: `object`

Defined in: packages/core/src/types/AbimongoConfig.ts:85

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

Defined in: packages/core/src/types/AbimongoConfig.ts:81

***

### schema?

> `optional` **schema**: [`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<[`Document`](../type-aliases/Document.md)\>

Defined in: packages/core/src/types/AbimongoConfig.ts:84
