# Variable: logger

> `const` **logger**: [`AbimongoLogger`](../classes/AbimongoLogger.md)

Defined in: [logger/logger.ts:172](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/logger/src/logger/logger.ts#L172)

Singleton instance of AbimongoLogger for application-wide use.
Configured to log in JSON format, stream to Redis, and flush logs every 2 seconds or after 20 entries.
Adjust the configuration as needed for your application.

## Example

```ts
import { logger } from './logger';
logger.log('This is an info message', 'info', { tenantId: 'tenant1' });
logger.log('This is an error message', 'error', { tenantId: 'tenant2' });
```
