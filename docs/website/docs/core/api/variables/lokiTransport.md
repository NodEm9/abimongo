[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / lokiTransport

# Variable: lokiTransport

> `const` **lokiTransport**: `RemoteTransporter`

Defined in: [packages/core/src/utils/logHelpers.ts:77](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/utils/logHelpers.ts#L77)

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
