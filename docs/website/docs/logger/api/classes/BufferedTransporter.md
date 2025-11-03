[**@abimongo/logger**](../README.md)

***

# Class: BufferedTransporter

Defined in: [transports/buffered.transporter.ts:30](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/transports/buffered.transporter.ts#L30)

BufferedTransporter

A logging transporter that buffers log messages and flushes them to an underlying transporter
at specified intervals or when the buffer reaches a certain size. This helps to optimize performance by reducing
the number of individual write operations.

## Example

```ts
const fileTransporter = new FileTransporter({ filename: 'logs/app.log' });
const bufferedTransporter = new BufferedTransporter(fileTransporter, {
  flushInterval: 5000, // Flush every 5 seconds
 flushSize: 20,      // or when buffer reaches 20 entries
});

await bufferedTransporter.write('This is a log message', 'info');
await bufferedTransporter.flush(); // Manually flush if needed
await bufferedTransporter.stop(); // Stop the transporter when done
```

## Implements

- [`Transporter`](../interfaces/Transporter.md)

## Constructors

### Constructor

> **new BufferedTransporter**(`transporter`, `options?`): `BufferedTransporter`

Defined in: [transports/buffered.transporter.ts:37](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/transports/buffered.transporter.ts#L37)

#### Parameters

##### transporter

[`Transporter`](../interfaces/Transporter.md)

##### options?

###### flushInterval?

`number`

###### flushSize?

`number`

#### Returns

`BufferedTransporter`

## Methods

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [transports/buffered.transporter.ts:62](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/transports/buffered.transporter.ts#L62)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Transporter`](../interfaces/Transporter.md).[`flush`](../interfaces/Transporter.md#flush)

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [transports/buffered.transporter.ts:90](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/transports/buffered.transporter.ts#L90)

#### Returns

`Promise`\<`void`\>

***

### write()

> **write**(`message`, `level?`, `meta?`): `Promise`\<`void`\>

Defined in: [transports/buffered.transporter.ts:48](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/transports/buffered.transporter.ts#L48)

#### Parameters

##### message

`string`

##### level?

`string`

##### meta?

`any`[]

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Transporter`](../interfaces/Transporter.md).[`write`](../interfaces/Transporter.md#write)
