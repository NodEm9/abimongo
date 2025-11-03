# Interface: AbimongoConfig

Defined in: [core/src/types/AbimongoConfig.ts:27](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/types/AbimongoConfig.ts#L27)

## Properties

### advanced?

> `optional` **advanced**: `object`

Defined in: [core/src/types/AbimongoConfig.ts:56](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/types/AbimongoConfig.ts#L56)

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

Defined in: [core/src/types/AbimongoConfig.ts:48](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/types/AbimongoConfig.ts#L48)

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

Defined in: [core/src/types/AbimongoConfig.ts:42](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/types/AbimongoConfig.ts#L42)

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

Defined in: [core/src/types/AbimongoConfig.ts:41](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/types/AbimongoConfig.ts#L41)

***

### model?

> `optional` **model**: [`AbimongoModelOptions`](AbimongoModelOptions.md)\<`any`\>

Defined in: [core/src/types/AbimongoConfig.ts:30](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/types/AbimongoConfig.ts#L30)

***

### mongoUri?

> `optional` **mongoUri**: `string`

Defined in: [core/src/types/AbimongoConfig.ts:29](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/types/AbimongoConfig.ts#L29)

***

### multiTenant?

> `optional` **multiTenant**: `object`

Defined in: [core/src/types/AbimongoConfig.ts:32](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/types/AbimongoConfig.ts#L32)

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

Defined in: [core/src/types/AbimongoConfig.ts:28](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/types/AbimongoConfig.ts#L28)

***

### schema?

> `optional` **schema**: [`SchemaDefinition`](../type-aliases/SchemaDefinition.md)\<[`Document`](../type-aliases/Document.md)\>

Defined in: [core/src/types/AbimongoConfig.ts:31](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/types/AbimongoConfig.ts#L31)
