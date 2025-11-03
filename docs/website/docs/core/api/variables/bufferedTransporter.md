[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / bufferedTransporter

# Variable: bufferedTransporter

> `const` **bufferedTransporter**: `BufferedTransporter`

Defined in: [core/src/utils/logHelpers.ts:47](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/utils/logHelpers.ts#L47)

Creates a resilient transporter that retries failed log writes with exponential backoff.
This is useful for ensuring that logs are not lost due to temporary issues.

## Returns

- A resilient buffered transporter.

## Example

```ts
const resilientLogger = createResilientTransporter(rotatingTransporter);