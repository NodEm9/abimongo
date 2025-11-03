# Variable: elasticTransport

> `const` **elasticTransport**: `RemoteTransporter`

Defined in: [core/src/utils/logHelpers.ts:61](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/utils/logHelpers.ts#L61)

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
