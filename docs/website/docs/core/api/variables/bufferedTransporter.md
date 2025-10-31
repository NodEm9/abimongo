[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / bufferedTransporter

# Variable: bufferedTransporter

> `const` **bufferedTransporter**: `BufferedTransporter`

Defined in: [packages/core/src/utils/logHelpers.ts:48](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/utils/logHelpers.ts#L48)

Creates a resilient transporter that retries failed log writes with exponential backoff.
This is useful for ensuring that logs are not lost due to temporary issues.

## Returns

- A resilient buffered transporter.

## Example

```ts
const resilientLogger = createResilientTransporter(rotatingTransporter);
```
