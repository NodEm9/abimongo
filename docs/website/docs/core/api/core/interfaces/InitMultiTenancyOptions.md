# Interface: InitMultiTenancyOptions

Defined in: packages/core/src/tanancy/init/initMultiTenancy.ts:5

## Properties

### config?

> `optional` **config**: `object`

Defined in: packages/core/src/tanancy/init/initMultiTenancy.ts:7

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

> `optional` **retentionPeriod**: `string` \| `number`

#### gcCron?

> `optional` **gcCron**: `string`

***

### lazy?

> `optional` **lazy**: `boolean`

Defined in: packages/core/src/tanancy/init/initMultiTenancy.ts:6
