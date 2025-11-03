[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / bufferedTransporter

# Variable: bufferedTransporter

> `const` **bufferedTransporter**: `BufferedTransporter`

Defined in: [core/src/utils/logHelpers.ts:47](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/utils/logHelpers.ts#L47)

Creates a resilient transporter that retries failed log writes with exponential backoff.
This is useful for ensuring that logs are not lost due to temporary issues.

## Returns

- A resilient buffered transporter.

## Example

```ts
const resilientLogger = createResilientTransporter(rotatingTransporter);
```
