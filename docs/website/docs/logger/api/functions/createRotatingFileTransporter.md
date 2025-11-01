[**@abimongo/logger**](../README.md)

***

# Function: createRotatingFileTransporter()

> **createRotatingFileTransporter**(`options?`): [`BufferedTransporter`](../classes/BufferedTransporter.md) \| \{ `close`: () => `Promise`\<`void`\>; `flush`: () => `Promise`\<`void`\>; `write`: (`message`) => `Promise`\<`void`\>; \}

Defined in: [transports/rotating.transporter.ts:38](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/transports/rotating.transporter.ts#L38)

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
```
