# Function: createResilientTransporter()

> **createResilientTransporter**(`baseTransporter`): [`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

Defined in: transports/remote.transport.ts:68

Wraps a base RemoteTransporter with resilience features such as retries and circuit breaking.

## Parameters

### baseTransporter

[`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

The base RemoteTransporter to be wrapped.

## Returns

[`RemoteTransporter`](../type-aliases/RemoteTransporter.md)

A resilient RemoteTransporter with retry and circuit breaker capabilities.
