[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / lokiTransport

# Variable: lokiTransport

> `const` **lokiTransport**: `RemoteTransporter`

Defined in: [core/src/utils/logHelpers.ts:76](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/utils/logHelpers.ts#L76)

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