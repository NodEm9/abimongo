[**@abimongo_utils/logger v1.4.6**](../README.md)

***

[@abimongo_utils/logger](../README.md) / createCircuitBreaker

# Function: createCircuitBreaker()

> **createCircuitBreaker**\<`T`\>(`fn`, `failureThreshold`, `cooldownPeriod`): (...`args`) => `Promise`\<`ReturnType`\<`T`\>\>

Defined in: [utils/circuitBreaker/circuitBreaker.ts:1](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/utils/circuitBreaker/circuitBreaker.ts#L1)

## Type Parameters

### T

`T` *extends* (...`args`) => `Promise`\<`any`\>

## Parameters

### fn

`T`

### failureThreshold

`number` = `3`

### cooldownPeriod

`number` = `10_000`

## Returns

> (...`args`): `Promise`\<`ReturnType`\<`T`\>\>

### Parameters

#### args

...`Parameters`\<`T`\>

### Returns

`Promise`\<`ReturnType`\<`T`\>\>
