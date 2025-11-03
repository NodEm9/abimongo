[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / elasticTransport

# Variable: elasticTransport

> `const` **elasticTransport**: `RemoteTransporter`

Defined in: [core/src/utils/logHelpers.ts:61](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/utils/logHelpers.ts#L61)

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
