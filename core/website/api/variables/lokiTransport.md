[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / lokiTransport

# Variable: lokiTransport

> `const` **lokiTransport**: `any`

Defined in: [src/utils/logHelpers.ts:77](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/utils/logHelpers.ts#L77)

Create a resilient transporter for Loki logs.
This transporter will retry failed log writes with exponential backoff.

## Param

The URL of the Loki instance.

## Param

Options for the Loki transport.

## Example

```ts
const lokiTransport = createLokiTransport('http://localhost:3100/loki/api/v1/push', {
	job: 'abimongo',
	instance: 'abimongo-instance',
});
```
