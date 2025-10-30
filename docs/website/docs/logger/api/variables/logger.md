[**@abimongo/logger**](../README.md)

***

# Variable: logger

> `const` **logger**: `AbimongoLogger`

Defined in: [logger/logger.ts:173](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/logger/logger.ts#L173)

## Instance

- logger
Singleton instance of AbimongoLogger for application-wide use. 
Configured to log in JSON format, stream to Redis, and flush logs every 2 seconds or after 20 entries. 
Adjust the configuration as needed for your application.

## Example

```ts
import { logger } from './logger';
logger.log('This is an info message', 'info', { tenantId: 'tenant1' });
logger.log('This is an error message', 'error', { tenantId: 'tenant2' });
```
