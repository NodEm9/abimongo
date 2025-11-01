[**@abimongo/logger**](../README.md)

***

# Class: FileTransporter

Defined in: [transports/fileTransport.ts:15](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/transports/fileTransport.ts#L15)

FileTransporter
A logging transporter that writes log messages to a specified file.
It appends log entries to the file in a formatted manner.

## Example

```ts
import { createFileTransporter } from './transports/fileTransporter';
const fileTransporter = createFileTransporter('logs/app.log');
 await fileTransporter.write('This is a log message', 'info');
```

## Implements

- [`Transporter`](../interfaces/Transporter.md)

## Constructors

### Constructor

> **new FileTransporter**(`stream`): `FileTransporter`

Defined in: [transports/fileTransport.ts:16](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/transports/fileTransport.ts#L16)

#### Parameters

##### stream

`WriteStream`

#### Returns

`FileTransporter`

## Properties

### stream

> **stream**: `WriteStream`

Defined in: [transports/fileTransport.ts:16](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/transports/fileTransport.ts#L16)

## Methods

### log()

> **log**(`level`, `message`, `meta`): `Promise`\<`void`\>

Defined in: [transports/fileTransport.ts:24](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/transports/fileTransport.ts#L24)

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

Defined in: [transports/fileTransport.ts:19](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/transports/fileTransport.ts#L19)

#### Parameters

##### message

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Transporter`](../interfaces/Transporter.md).[`write`](../interfaces/Transporter.md#write)
