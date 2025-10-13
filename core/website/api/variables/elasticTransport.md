[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / elasticTransport

# Variable: elasticTransport

> `const` **elasticTransport**: `any`

Defined in: [src/utils/logHelpers.ts:62](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/utils/logHelpers.ts#L62)

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
