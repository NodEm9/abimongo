[**@abimongo/logger**](../README.md)

***

# Function: registerInterval()

> **registerInterval**(`id`): `Timeout`

Defined in: [utils/TimerRegistry.ts:12](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/logger/src/utils/TimerRegistry.ts#L12)

Registers an interval and adds it to the internal set.
This is useful for tracking and managing intervals in the application.

## Parameters

### id

`Timeout`

The interval ID returned by `setInterval`.

## Returns

`Timeout`

The registered interval ID.

## Example

```ts
const intervalId = registerInterval(setInterval(() => console.log('Hello'), 1000));
```
