[**@abimongo/logger**](../README.md)

***

# Class: AbimongoLogger

Defined in: [logger/logger.ts:43](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/logger/logger.ts#L43)

AbimongoLogger is a custom logger that supports multiple tenants,
file-based logging with daily rotation, and metrics tracking.
It can log messages in both JSON and text formats.

## Example

```ts
const logger = new AbimongoLogger({
 format: 'json', // or 'text'
baseLogPath: '/var/logs/abimongo',
streamToRedis: true,
redisUrl: 'redis://localhost:6379',
 flushInterval: 2000, // flush logs every 2 seconds
 flushSize: 20, // flush after 20 log entries
});
* logger.log('This is a log message', 'info', { tenantId: 'tenant1' });
* logger.log('This is an error message', 'error', { tenantId: 'tenant2' });
```

## Constructors

### Constructor

> **new AbimongoLogger**(`options`): `AbimongoLogger`

Defined in: [logger/logger.ts:48](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/logger/logger.ts#L48)

#### Parameters

##### options

`LoggerOptions` = `{}`

#### Returns

`AbimongoLogger`

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [logger/logger.ts:141](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/logger/logger.ts#L141)

#### Returns

`Promise`\<`void`\>

***

### flushAll()

> **flushAll**(): `Promise`\<`void`\>

Defined in: [logger/logger.ts:125](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/logger/logger.ts#L125)

#### Returns

`Promise`\<`void`\>

***

### getMetrics()

> **getMetrics**(): [`MetricsTracker`](MetricsTracker.md)

Defined in: [logger/logger.ts:158](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/logger/logger.ts#L158)

#### Returns

[`MetricsTracker`](MetricsTracker.md)

***

### log()

> **log**(`message`, `level`, `meta`): `Promise`\<`void`\>

Defined in: [logger/logger.ts:69](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/logger/logger.ts#L69)

Logs a message with the specified level and metadata.

#### Parameters

##### message

`string`

The message to log.

##### level

[`LogLevel`](../type-aliases/LogLevel.md) = `'info'`

The log level (default: 'info').

##### meta

`LogMeta` = `{}`

Additional metadata for the log entry.

#### Returns

`Promise`\<`void`\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [logger/logger.ts:150](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/logger/logger.ts#L150)

#### Returns

`Promise`\<`void`\>

***

### startTrackingMetrics()

> **startTrackingMetrics**(`interval`): [`MetricsTracker`](MetricsTracker.md)

Defined in: [logger/logger.ts:131](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/logger/logger.ts#L131)

#### Parameters

##### interval

`number` = `60000`

#### Returns

[`MetricsTracker`](MetricsTracker.md)

***

### stopTrackingMetrics()

> **stopTrackingMetrics**(): `void`

Defined in: [logger/logger.ts:136](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/logger/src/logger/logger.ts#L136)

#### Returns

`void`
