[**@abimongo_utils/logger v1.4.6**](../README.md)

***

[@abimongo_utils/logger](../README.md) / FileTransporter

# Class: FileTransporter

Defined in: [transports/fileTransport.ts:6](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/fileTransport.ts#L6)

## Implements

- [`Transporter`](../interfaces/Transporter.md)

## Constructors

### Constructor

> **new FileTransporter**(`stream`): `FileTransporter`

Defined in: [transports/fileTransport.ts:7](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/fileTransport.ts#L7)

#### Parameters

##### stream

`WriteStream`

#### Returns

`FileTransporter`

## Properties

### stream

> **stream**: `WriteStream`

Defined in: [transports/fileTransport.ts:7](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/fileTransport.ts#L7)

## Methods

### log()

> **log**(`level`, `message`, `meta`): `Promise`\<`void`\>

Defined in: [transports/fileTransport.ts:13](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/fileTransport.ts#L13)

#### Parameters

##### level

[`LogLevel`](../type-aliases/LogLevel.md)

##### message

`string`

##### meta

`any`[] = `[]`

#### Returns

`Promise`\<`void`\>

***

### write()

> **write**(`message`): `Promise`\<`void`\>

Defined in: [transports/fileTransport.ts:8](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/fileTransport.ts#L8)

#### Parameters

##### message

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Transporter`](../interfaces/Transporter.md).[`write`](../interfaces/Transporter.md#write)
