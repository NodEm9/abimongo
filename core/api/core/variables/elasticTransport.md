# Variable: elasticTransport

> `const` **elasticTransport**: `RemoteTransporter`

Defined in: [core/src/utils/logHelpers.ts:61](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/utils/logHelpers.ts#L61)

Create a resilient transporter for elasticsearch logs.
This transporter will retry failed log writes with exponential backoff.

## Param

The URL of the Elasticsearch instance.

## Param

The name of the Elasticsearch index to write logs to.

## Example

```ts
const elasticTransport = createElasticTransport('http://localhost:9200', 'abimongo-logs');
```
