[**@abimongo/logger**](../README.md)

***

# Function: createResilientTransporter()

> **createResilientTransporter**(`baseTransporter`): [`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

Defined in: [transports/remote.transport.ts:68](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/transports/remote.transport.ts#L68)

Wraps a base RemoteTransporter with resilience features such as retries and circuit breaking.

## Parameters

### baseTransporter

[`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

The base RemoteTransporter to be wrapped.

## Returns

[`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

A resilient RemoteTransporter with retry and circuit breaker capabilities.
