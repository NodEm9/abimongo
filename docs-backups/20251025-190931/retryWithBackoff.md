[**@abimongo_utils/logger v1.4.6**](../README.md)

***

[@abimongo_utils/logger](../README.md) / retryWithBackoff

# Function: retryWithBackoff()

> **retryWithBackoff**\<`T`\>(`fn`, `retries`, `delayMs`, `backoffFactor`): `Promise`\<`T`\>

Defined in: [utils/retry/retryWithBackoff.ts:1](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/utils/retry/retryWithBackoff.ts#L1)

## Type Parameters

### T

`T`

## Parameters

### fn

() => `Promise`\<`T`\>

### retries

`number` = `5`

### delayMs

`number` = `500`

### backoffFactor

`number` = `2`

## Returns

`Promise`\<`T`\>
