# Variable: bufferedTransporter

> `const` **bufferedTransporter**: `BufferedTransporter`

Defined in: [core/src/utils/logHelpers.ts:47](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/utils/logHelpers.ts#L47)

Creates a resilient transporter that retries failed log writes with exponential backoff.
This is useful for ensuring that logs are not lost due to temporary issues.

## Returns

- A resilient buffered transporter.

## Example

```ts
const resilientLogger = createResilientTransporter(rotatingTransporter);
```
