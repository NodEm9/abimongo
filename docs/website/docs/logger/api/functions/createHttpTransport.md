[**@abimongo/logger**](../README.md)

***

# Function: createHttpTransport()

> **createHttpTransport**(`url`): [`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

Defined in: [transports/remote.transport.ts:10](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/transports/remote.transport.ts#L10)

Creates an HTTP remote transporter that sends log messages to a specified URL via HTTP POST requests.

## Parameters

### url

`string`

The endpoint URL to which log messages will be sent.

## Returns

[`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

A RemoteTransporter function that sends log messages to the specified URL.
