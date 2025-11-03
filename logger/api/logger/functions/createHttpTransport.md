# Function: createHttpTransport()

> **createHttpTransport**(`url`): [`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

Defined in: [transports/remote.transport.ts:10](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/logger/src/transports/remote.transport.ts#L10)

Creates an HTTP remote transporter that sends log messages to a specified URL via HTTP POST requests.

## Parameters

### url

`string`

The endpoint URL to which log messages will be sent.

## Returns

[`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

A RemoteTransporter function that sends log messages to the specified URL.
