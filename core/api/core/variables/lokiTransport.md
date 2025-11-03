# Variable: lokiTransport

> `const` **lokiTransport**: `RemoteTransporter`

Defined in: [core/src/utils/logHelpers.ts:76](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/utils/logHelpers.ts#L76)

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
