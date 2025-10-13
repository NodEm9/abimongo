[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / InitMultiTenancyOptions

# Interface: InitMultiTenancyOptions

Defined in: [src/tanancy/init/initMultiTenancy.ts:5](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/tanancy/init/initMultiTenancy.ts#L5)

## Properties

### config?

> `optional` **config**: [`AbimongoLoggerSettings`](AbimongoLoggerSettings.md) & `object`

Defined in: [src/tanancy/init/initMultiTenancy.ts:7](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/tanancy/init/initMultiTenancy.ts#L7)

#### Type declaration

##### circuitBreaker?

> `optional` **circuitBreaker**: `object`

###### circuitBreaker.enabled?

> `optional` **enabled**: `boolean`

###### circuitBreaker.retryAttempts?

> `optional` **retryAttempts**: `number`

##### garbageCollector?

> `optional` **garbageCollector**: `object`

###### garbageCollector.enabled?

> `optional` **enabled**: `boolean`

###### garbageCollector.logResults?

> `optional` **logResults**: `boolean`

###### garbageCollector.retentionPeriod?

> `optional` **retentionPeriod**: `string` \| `number`

##### gcCron?

> `optional` **gcCron**: `string`

***

### lazy?

> `optional` **lazy**: `boolean`

Defined in: [src/tanancy/init/initMultiTenancy.ts:6](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/tanancy/init/initMultiTenancy.ts#L6)
