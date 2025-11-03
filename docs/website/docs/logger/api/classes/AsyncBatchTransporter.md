[**@abimongo/logger**](../README.md)

***

# Class: AsyncBatchTransporter

Defined in: [transports/async-batch.transporter.ts:29](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/logger/src/transports/async-batch.transporter.ts#L29)

AsyncBatchTransporter

A logging transporter that batches log messages and sends them asynchronously.
It collects log entries in a buffer and sends them in batches based on a specified size or time interval.
This approach optimizes performance by reducing the number of individual log write operations.

## Example

```ts
const transporter = new AsyncBatchTransporter({
  batchSize: 20, // Send logs in batches of 20
 flushInterval: 3000, // or every 3 seconds
 sendBatch: async (entries) => {
  // Custom logic to send log entries, e.g., to a remote server
 await sendLogsToServer(entries);
 },
});

transporter.log('info', 'This is a log message', { userId: 123 });
await transporter.flush(); // Manually flush if needed
transporter.stop(); // Stop the transporter when done
```

## Constructors

### Constructor

> **new AsyncBatchTransporter**(`options`): `AsyncBatchTransporter`

Defined in: [transports/async-batch.transporter.ts:37](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/logger/src/transports/async-batch.transporter.ts#L37)

#### Parameters

##### options

[`AsyncBatchTransporterOptions`](../interfaces/AsyncBatchTransporterOptions.md) & `object`

#### Returns

`AsyncBatchTransporter`

## Methods

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [transports/async-batch.transporter.ts:62](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/logger/src/transports/async-batch.transporter.ts#L62)

#### Returns

`Promise`\<`void`\>

***

### log()

> **log**(`level`, `message`, `meta`): `void`

Defined in: [transports/async-batch.transporter.ts:46](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/logger/src/transports/async-batch.transporter.ts#L46)

#### Parameters

##### level

[`LogLevel`](../type-aliases/LogLevel.md)

##### message

`string`

##### meta

`any`[]

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [transports/async-batch.transporter.ts:78](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/logger/src/transports/async-batch.transporter.ts#L78)

#### Returns

`void`
