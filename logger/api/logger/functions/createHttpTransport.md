# Function: createHttpTransport()

> **createHttpTransport**(`url`): [`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

Defined in: [transports/remote.transport.ts:10](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/logger/src/transports/remote.transport.ts#L10)

Creates an HTTP remote transporter that sends log messages to a specified URL via HTTP POST requests.

## Parameters

### url

`string`

The endpoint URL to which log messages will be sent.

## Returns

[`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

A RemoteTransporter function that sends log messages to the specified URL.
