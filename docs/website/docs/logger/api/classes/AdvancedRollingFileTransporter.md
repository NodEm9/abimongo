[**@abimongo/logger**](../README.md)

***

# Class: AdvancedRollingFileTransporter

Defined in: [transports/AdvancedRollingFileTransporter.ts:46](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/transports/AdvancedRollingFileTransporter.ts#L46)

- AdvancedRollingFileTransporter

A logging transporter that writes log messages to a file with advanced rolling features.
Logs can be rotated based on file size or time intervals (daily/hourly).
Supports compression of old log files and maintains a specified number of backup files.
Also includes a buffering mechanism to optimize write operations and periodic flushing.

## Example

```typescript
const transporter = new AdvancedRollingFileTransporter({
  filename: 'logs/app.log',
  maxSize: 10 * 1024 * 1024, // 10 MB
  backupCount: 7,
  frequency: 'daily',
  compress: true,
  flushInterval: 5000, // Flush every 5 seconds
});

await transporter.write('This is a log message', 'info');
await transporter.flush(); // Manually flush if needed
await transporter.close(); // Close the transporter when done
```

## Constructors

### Constructor

> **new AdvancedRollingFileTransporter**(`options`): `AdvancedRollingFileTransporter`

Defined in: [transports/AdvancedRollingFileTransporter.ts:54](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/transports/AdvancedRollingFileTransporter.ts#L54)

#### Parameters

##### options

`RollingFileOptions`

#### Returns

`AdvancedRollingFileTransporter`

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [transports/AdvancedRollingFileTransporter.ts:230](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/transports/AdvancedRollingFileTransporter.ts#L230)

#### Returns

`Promise`\<`void`\>

***

### ensureDirectoryExists()

> **ensureDirectoryExists**(): `void`

Defined in: [transports/AdvancedRollingFileTransporter.ts:219](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/transports/AdvancedRollingFileTransporter.ts#L219)

#### Returns

`void`

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [transports/AdvancedRollingFileTransporter.ts:181](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/transports/AdvancedRollingFileTransporter.ts#L181)

#### Returns

`Promise`\<`void`\>

***

### getLogDirectory()

> **getLogDirectory**(): `string`

Defined in: [transports/AdvancedRollingFileTransporter.ts:227](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/transports/AdvancedRollingFileTransporter.ts#L227)

#### Returns

`string`

***

### write()

> **write**(`message`, `_level?`): `Promise`\<`void`\>

Defined in: [transports/AdvancedRollingFileTransporter.ts:166](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/transports/AdvancedRollingFileTransporter.ts#L166)

#### Parameters

##### message

`string`

##### \_level?

[`LogLevel`](../type-aliases/LogLevel.md)

#### Returns

`Promise`\<`void`\>
