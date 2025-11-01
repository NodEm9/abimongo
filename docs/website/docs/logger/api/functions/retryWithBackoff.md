[**@abimongo/logger**](../README.md)

***

# Function: retryWithBackoff()

> **retryWithBackoff**\<`T`\>(`fn`, `retries`, `delayMs`, `backoffFactor`): `Promise`\<`T`\>

Defined in: [utils/retry/retryWithBackoff.ts:9](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/utils/retry/retryWithBackoff.ts#L9)

Retries an asynchronous function with exponential backoff.

## Type Parameters

### T

`T`

## Parameters

### fn

() => `Promise`\<`T`\>

The asynchronous function to retry.

### retries

`number` = `5`

The maximum number of retry attempts.

### delayMs

`number` = `500`

The initial delay in milliseconds before retrying.

### backoffFactor

`number` = `2`

The factor by which to multiply the delay after each failed attempt.

## Returns

`Promise`\<`T`\>

The result of the asynchronous function if successful.

## Throws

The error from the last failed attempt if all retries are exhausted.
