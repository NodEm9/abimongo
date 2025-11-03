[**@abimongo/logger**](../README.md)

***

# Function: createElasticTransport()

> **createElasticTransport**(`url`, `index`): [`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

Defined in: [transports/remote.transport.ts:27](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/transports/remote.transport.ts#L27)

Creates an ElasticSearch transporter that sends log messages to a specified ElasticSearch index.

## Parameters

### url

`string`

The base URL of the ElasticSearch server.

### index

`string`

The index name where log messages will be stored.

## Returns

[`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

A RemoteTransporter function that sends log messages to the specified ElasticSearch index.
