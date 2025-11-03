[**@abimongo/logger**](../README.md)

***

# Variable: logger

> `const` **logger**: [`AbimongoLogger`](../classes/AbimongoLogger.md)

Defined in: [logger/logger.ts:172](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/logger/logger.ts#L172)

Singleton instance of AbimongoLogger for application-wide use.
Configured to log in JSON format, stream to Redis, and flush logs every 2 seconds or after 20 entries.
Adjust the configuration as needed for your application.

## Example

```ts
import { logger } from './logger';
logger.log('This is an info message', 'info', { tenantId: 'tenant1' });
logger.log('This is an error message', 'error', { tenantId: 'tenant2' });