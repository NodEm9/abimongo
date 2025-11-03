[**@abimongo/logger**](../README.md)

***

# Function: registerTimeout()

> **registerTimeout**(`id`): `Timeout`

Defined in: [utils/TimerRegistry.ts:25](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/utils/TimerRegistry.ts#L25)

Registers a timeout and adds it to the internal set.
This is useful for tracking and managing timeouts in the application.

## Parameters

### id

`Timeout`

The timeout ID returned by `setTimeout`.

## Returns

`Timeout`

The registered timeout ID.

## Example

```ts
const timeoutId = registerTimeout(setTimeout(() => console.log('Hello'), 1000));
```
