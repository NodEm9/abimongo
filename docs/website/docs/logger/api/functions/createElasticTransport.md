[**@abimongo/logger**](../README.md)

***

# Function: createElasticTransport()

> **createElasticTransport**(`url`, `index`): [`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

Defined in: [transports/remote.transport.ts:27](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/transports/remote.transport.ts#L27)

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
