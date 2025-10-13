[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / bufferedTransporter

# Variable: bufferedTransporter

> `const` **bufferedTransporter**: `any`

Defined in: [src/utils/logHelpers.ts:47](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/utils/logHelpers.ts#L47)

Creates a resilient transporter that retries failed log writes with exponential backoff.
This is useful for ensuring that logs are not lost due to temporary issues.

## Param

The buffered transporter to wrap.

## Returns

- A resilient buffered transporter.

## Example

```ts
const resilientLogger = createResilientTransporter(rotatingTransporter);
```
