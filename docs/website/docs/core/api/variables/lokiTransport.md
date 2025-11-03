[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / lokiTransport

# Variable: lokiTransport

> `const` **lokiTransport**: `RemoteTransporter`

Defined in: [core/src/utils/logHelpers.ts:76](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/utils/logHelpers.ts#L76)

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
