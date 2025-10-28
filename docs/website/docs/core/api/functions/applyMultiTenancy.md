[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / applyMultiTenancy

# Function: applyMultiTenancy()

> **applyMultiTenancy**(`app`, `tenants`, `options?`): `Promise`\<`void`\>

Defined in: [packages/core/src/tanancy/applyMultiTenancy.ts:68](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/tanancy/applyMultiTenancy.ts#L68)

Applies multi-tenancy middleware to a MongoDB connection.

This should be used at the beginning of your app to inject the tenant ID into
the context of all Abimongo operations. It reads the tenant identifier from
a request header or other identifier.

## Parameters

### app

`Application`

An Express.js app instance

### tenants

`Record`\<`string`, `string`\>

A record of tenant IDs mapped to their MongoDB URIs

### options?

Optional configuration for multi-tenancy

#### headerKey?

`string`

The HTTP header key used to identify the tenant ID

#### initOptions?

[`InitMultiTenancyOptions`](../interfaces/InitMultiTenancyOptions.md)

Options for initializing multi-tenancy

## Returns

`Promise`\<`void`\>

The modified Express app with middleware applied

## Throws

If the tenant ID is missing in the request and no default tenant ID is configured

## Example

```ts
import express from 'express';
import { applyMultiTenancy } from 'abimongo_core';

const app = express();

await applyMultiTenancy(app, tenants, {
	headerKey: 'x-tenant-id',
	initOptions: {
		lazy: true,  // Lazy initialization of tenants
		config: {
			enabled: true,
			logLevel: 'info', // Set the log level
			useColor: true, // Enable colored logs
			transports: [
				{
					write: (message: string) => {
						console.log(message); // Log to console
					},
				},
				consoleTransport(true)
			], // Use console transport for logging
			json: false, // Disable JSON format for logs,
			formatOptions: {
				// Customize the log format if needed
				timestamp: true, // Include timestamp in logs
				colors: true, // Enable colors in logs
			},
			hooks: {
				onTenantRegistered: (tenantId) => {
					logger.info(`Tenant registered: ${tenantId}`);
				},
				onTenantError: (tenantId, error) => {
					logger.error(`Error registering tenant ${tenantId}:`, error);
				},
			}
			// Place valid AbimongoLoggerSettings properties here if needed
		}
	},
})
```
*

## Remarks

This function is designed to be used in an Express.js application to handle multi-tenancy by setting the tenant context based on a request header. It initializes the tenants and applies middleware to set the tenant ID for each request, allowing for tenant-specific operations in Abimongo.

## See

[initMultiTenancy](initMultiTenancy.md) for initializing tenants with their MongoDB URIs.
