[**@abimongo/logger**](../README.md)

***

# Function: createResilientTransporter()

> **createResilientTransporter**(`baseTransporter`): [`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

Defined in: [transports/remote.transport.ts:68](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/transports/remote.transport.ts#L68)

Wraps a base RemoteTransporter with resilience features such as retries and circuit breaking.

## Parameters

### baseTransporter

[`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

The base RemoteTransporter to be wrapped.

## Returns

[`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

A resilient RemoteTransporter with retry and circuit breaker capabilities.
