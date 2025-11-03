[**@abimongo/logger**](../README.md)

***

# Function: createRotatingFileTransporter()

> **createRotatingFileTransporter**(`options?`): [`BufferedTransporter`](../classes/BufferedTransporter.md) \| \{ `close`: () => `Promise`\<`void`\>; `flush`: () => `Promise`\<`void`\>; `write`: (`message`) => `Promise`\<`void`\>; \}

Defined in: [transports/rotating.transporter.ts:38](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/transports/rotating.transporter.ts#L38)

Creates a rotating file transporter for logging.

## Parameters

### options?

[`RotatingFileTransporterOptions`](../interfaces/RotatingFileTransporterOptions.md)

Configuration options for the rotating file transporter.

## Returns

[`BufferedTransporter`](../classes/BufferedTransporter.md) \| \{ `close`: () => `Promise`\<`void`\>; `flush`: () => `Promise`\<`void`\>; `write`: (`message`) => `Promise`\<`void`\>; \}

A function that writes log messages to the rotating file.

## Example

```ts
const rotatingTransporter = createRotatingFileTransporter({
  filename: 'logs/app.log',
 frequency: 'daily',
maxSize: 10 * 1024 * 1024, // 10 MB
backupCount: 7,
compress: true,
 flushInterval: 5000, // Flush every 5 seconds
});

await rotatingTransporter.write('This is a log message');
await rotatingTransporter.flush(); // Manually flush if needed
await rotatingTransporter.close(); // Close the transporter when done