# Function: registerInterval()

> **registerInterval**(`id`): `Timeout`

Defined in: [utils/TimerRegistry.ts:12](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/logger/src/utils/TimerRegistry.ts#L12)

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
