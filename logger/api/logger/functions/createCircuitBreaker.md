# Function: createCircuitBreaker()

> **createCircuitBreaker**\<`T`\>(`fn`, `failureThreshold`, `cooldownPeriod`): (...`args`) => `Promise`\<`ReturnType`\<`T`\>\>

Defined in: [utils/circuitBreaker/circuitBreaker.ts:8](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/logger/src/utils/circuitBreaker/circuitBreaker.ts#L8)

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
