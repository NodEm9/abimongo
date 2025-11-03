[**@abimongo/logger**](../README.md)

***

# Interface: LoggerConfig

Defined in: [types/abimongoConfig.ts:26](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L26)

## Properties

### circuitBreaker?

> `optional` **circuitBreaker**: `object`

Defined in: [types/abimongoConfig.ts:37](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L37)

#### enabled?

> `optional` **enabled**: `boolean`

#### retryAttempts?

> `optional` **retryAttempts**: `number`

#### retryDelay?

> `optional` **retryDelay**: `number`

***

### colorize?

> `optional` **colorize**: `boolean`

Defined in: [types/abimongoConfig.ts:29](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L29)

***

### compressLogFiles?

> `optional` **compressLogFiles**: `object`

Defined in: [types/abimongoConfig.ts:43](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L43)

#### enabled?

> `optional` **enabled**: `boolean`

***

### enableMetrics?

> `optional` **enableMetrics**: `object`

Defined in: [types/abimongoConfig.ts:39](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L39)

#### enabled?

> `optional` **enabled**: `boolean`

#### logInterval?

> `optional` **logInterval**: `number`

***

### enrichMetadata()?

> `optional` **enrichMetadata**: (`meta`) => `Record`\<`string`, `any`\>

Defined in: [types/abimongoConfig.ts:35](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L35)

#### Parameters

##### meta

`Record`\<`string`, `any`\>

#### Returns

`Record`\<`string`, `any`\>

***

### excludedSources?

> `optional` **excludedSources**: `string`[]

Defined in: [types/abimongoConfig.ts:32](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L32)

***

### formatOptions?

> `optional` **formatOptions**: [`LoggerFormatOptions`](LoggerFormatOptions.md)

Defined in: [types/abimongoConfig.ts:33](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L33)

***

### garbageCollector?

> `optional` **garbageCollector**: `object`

Defined in: [types/abimongoConfig.ts:38](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L38)

#### enabled?

> `optional` **enabled**: `boolean`

#### logResults?

> `optional` **logResults**: `boolean`

#### retentionPeriod?

> `optional` **retentionPeriod**: `number`

***

### hooks?

> `optional` **hooks**: [`LoggerHooks`](LoggerHooks.md)

Defined in: [types/abimongoConfig.ts:34](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L34)

***

### json?

> `optional` **json**: `boolean`

Defined in: [types/abimongoConfig.ts:30](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L30)

***

### level?

> `optional` **level**: [`LogLevel`](../type-aliases/LogLevel.md)

Defined in: [types/abimongoConfig.ts:28](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L28)

***

### logger?

> `optional` **logger**: [`ILogger`](ILogger.md)

Defined in: [types/abimongoConfig.ts:27](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L27)

***

### shouldLog()?

> `optional` **shouldLog**: (`level`, `meta?`) => `boolean`

Defined in: [types/abimongoConfig.ts:36](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L36)

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

Defined in: [types/abimongoConfig.ts:31](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/types/abimongoConfig.ts#L31)
