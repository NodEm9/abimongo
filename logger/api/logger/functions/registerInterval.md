# Function: registerInterval()

> **registerInterval**(`id`): `Timeout`

Defined in: [utils/TimerRegistry.ts:12](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/logger/src/utils/TimerRegistry.ts#L12)

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
