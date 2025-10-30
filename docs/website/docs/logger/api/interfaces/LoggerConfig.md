[**@abimongo/logger**](../README.md)

***

# Interface: LoggerConfig

Defined in: [types/abimongoConfig.ts:25](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L25)

## Properties

### circuitBreaker?

> `optional` **circuitBreaker**: `object`

Defined in: [types/abimongoConfig.ts:36](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L36)

#### enabled?

> `optional` **enabled**: `boolean`

#### retryAttempts?

> `optional` **retryAttempts**: `number`

#### retryDelay?

> `optional` **retryDelay**: `number`

***

### colorize?

> `optional` **colorize**: `boolean`

Defined in: [types/abimongoConfig.ts:28](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L28)

***

### compressLogFiles?

> `optional` **compressLogFiles**: `object`

Defined in: [types/abimongoConfig.ts:42](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L42)

#### enabled?

> `optional` **enabled**: `boolean`

***

### enableMetrics?

> `optional` **enableMetrics**: `object`

Defined in: [types/abimongoConfig.ts:38](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L38)

#### enabled?

> `optional` **enabled**: `boolean`

#### logInterval?

> `optional` **logInterval**: `number`

***

### enrichMetadata()?

> `optional` **enrichMetadata**: (`meta`) => `Record`\<`string`, `any`\>

Defined in: [types/abimongoConfig.ts:34](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L34)

#### Parameters

##### meta

`Record`\<`string`, `any`\>

#### Returns

`Record`\<`string`, `any`\>

***

### excludedSources?

> `optional` **excludedSources**: `string`[]

Defined in: [types/abimongoConfig.ts:31](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L31)

***

### formatOptions?

> `optional` **formatOptions**: [`LoggerFormatOptions`](LoggerFormatOptions.md)

Defined in: [types/abimongoConfig.ts:32](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L32)

***

### garbageCollector?

> `optional` **garbageCollector**: `object`

Defined in: [types/abimongoConfig.ts:37](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L37)

#### enabled?

> `optional` **enabled**: `boolean`

#### logResults?

> `optional` **logResults**: `boolean`

#### retentionPeriod?

> `optional` **retentionPeriod**: `number`

***

### hooks?

> `optional` **hooks**: [`LoggerHooks`](LoggerHooks.md)

Defined in: [types/abimongoConfig.ts:33](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L33)

***

### json?

> `optional` **json**: `boolean`

Defined in: [types/abimongoConfig.ts:29](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L29)

***

### level?

> `optional` **level**: [`LogLevel`](../type-aliases/LogLevel.md)

Defined in: [types/abimongoConfig.ts:27](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L27)

***

### logger?

> `optional` **logger**: [`ILogger`](ILogger.md)

Defined in: [types/abimongoConfig.ts:26](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L26)

***

### shouldLog()?

> `optional` **shouldLog**: (`level`, `meta?`) => `boolean`

Defined in: [types/abimongoConfig.ts:35](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L35)

#### Parameters

##### level

[`LogLevel`](../type-aliases/LogLevel.md)

##### meta?

`Record`\<`string`, `any`\>

#### Returns

`boolean`

***

### transports?

> `optional` **transports**: ([`Transporter`](Transporter.md) \| [`RemoteTransporter`](../type-aliases/RemoteTransporter.md))[]

Defined in: [types/abimongoConfig.ts:30](https://github.com/NodEm9/abimongo/blob/f798227fd9c43f8c2647fd11dd772b40a643da1f/packages/logger/src/types/abimongoConfig.ts#L30)
