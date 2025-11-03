# Function: createCircuitBreaker()

> **createCircuitBreaker**\<`T`\>(`fn`, `failureThreshold`, `cooldownPeriod`): (...`args`) => `Promise`\<`ReturnType`\<`T`\>\>

Defined in: [utils/circuitBreaker/circuitBreaker.ts:8](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/logger/src/utils/circuitBreaker/circuitBreaker.ts#L8)

Creates a circuit breaker for a given asynchronous function.

## Type Parameters

### T

`T` *extends* (...`args`) => `Promise`\<`any`\>

## Parameters

### fn

`T`

The asynchronous function to wrap with a circuit breaker.

### failureThreshold

`number` = `3`

The number of consecutive failures before opening the circuit.

### cooldownPeriod

`number` = `10_000`

The time in milliseconds to wait before closing the circuit again.

## Returns

A wrapped function with circuit breaker functionality.

> (...`args`): `Promise`\<`ReturnType`\<`T`\>\>

### Parameters

#### args

...`Parameters`\<`T`\>

### Returns

`Promise`\<`ReturnType`\<`T`\>\>
