[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / bufferedTransporter

# Variable: bufferedTransporter

> `const` **bufferedTransporter**: `BufferedTransporter`

Defined in: [packages/core/src/utils/logHelpers.ts:48](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/utils/logHelpers.ts#L48)

Creates a resilient transporter that retries failed log writes with exponential backoff.
This is useful for ensuring that logs are not lost due to temporary issues.

## Returns

- A resilient buffered transporter.

## Example

```ts
const resilientLogger = createResilientTransporter(rotatingTransporter);
```
