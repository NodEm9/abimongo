[**@abimongo_utils/logger v1.4.6**](../README.md)

***

[@abimongo_utils/logger](../README.md) / createRotatingFileTransporter

# Function: createRotatingFileTransporter()

> **createRotatingFileTransporter**(`options?`): `object`

Defined in: [transports/rotating.transporter.ts:20](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/rotating.transporter.ts#L20)

Creates a rotating file transporter for logging.

## Parameters

### options?

[`RotatingFileTransporterOptions`](../interfaces/RotatingFileTransporterOptions.md)

Configuration options for the rotating file transporter.

## Returns

`object`

A function that writes log messages to the rotating file.

### close()

> **close**: () => `void`

#### Returns

`void`

### flush()

> **flush**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### write()

> **write**: (`message`) => `Promise`\<`void`\>

#### Parameters

##### message

`string`

#### Returns

`Promise`\<`void`\>
