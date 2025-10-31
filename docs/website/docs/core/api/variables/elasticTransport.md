[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / elasticTransport

# Variable: elasticTransport

> `const` **elasticTransport**: `RemoteTransporter`

Defined in: [packages/core/src/utils/logHelpers.ts:62](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/utils/logHelpers.ts#L62)

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
