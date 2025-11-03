[**@abimongo/logger**](../README.md)

***

# Function: createLokiTransport()

> **createLokiTransport**(`pushUrl`, `labels`): [`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

Defined in: [transports/remote.transport.ts:45](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/transports/remote.transport.ts#L45)

Creates a Loki transporter that sends log messages to a specified Loki push URL with given labels.

## Parameters

### pushUrl

`string`

The Loki push endpoint URL.

### labels

`Record`\<`string`, `string`\>

A record of labels to attach to the log streams.

## Returns

[`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

A RemoteTransporter function that sends log messages to the specified Loki push URL.
