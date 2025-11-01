[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoLoggerSettings

# Interface: AbimongoLoggerSettings

Defined in: [packages/core/src/types/AbimongoConfig.ts:8](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L8)

## Extends

- `LoggerConfig`

## Properties

### circuitBreaker?

> `optional` **circuitBreaker**: `object`

Defined in: [packages/core/src/types/AbimongoConfig.ts:22](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L22)

#### enabled?

> `optional` **enabled**: `boolean`

#### retryAttempts?

> `optional` **retryAttempts**: `number`

#### retryDelay?

> `optional` **retryDelay**: `number`

#### Overrides

`LoggerConfig.circuitBreaker`

***

### colorize?

> `optional` **colorize**: `boolean`

Defined in: [packages/core/src/types/AbimongoConfig.ts:13](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L13)

#### Overrides

`LoggerConfig.colorize`

***

### compressLogFiles?

> `optional` **compressLogFiles**: `object`

Defined in: [packages/core/src/types/AbimongoConfig.ts:23](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L23)

#### enabled?

> `optional` **enabled**: `boolean`

#### Overrides

`LoggerConfig.compressLogFiles`

***

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/core/src/types/AbimongoConfig.ts:9](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L9)

***

### enableMetrics?

> `optional` **enableMetrics**: `object`

Defined in: [packages/core/src/types/AbimongoConfig.ts:20](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L20)

#### enabled?

> `optional` **enabled**: `boolean`

#### logInterval?

> `optional` **logInterval**: `number`

#### Overrides

`LoggerConfig.enableMetrics`

***

### enrichMetadata()?

> `optional` **enrichMetadata**: (`meta`) => `Record`\<`string`, `any`\>

Defined in: [packages/core/src/types/AbimongoConfig.ts:19](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L19)

#### Parameters

##### meta

`Record`\<`string`, `any`\>

#### Returns

`Record`\<`string`, `any`\>

#### Overrides

`LoggerConfig.enrichMetadata`

***

### excludedSources?

> `optional` **excludedSources**: `string`[]

Defined in: [packages/core/src/types/AbimongoConfig.ts:17](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L17)

#### Overrides

`LoggerConfig.excludedSources`

***

### formatOptions?

> `optional` **formatOptions**: `LoggerFormatOptions`

Defined in: [packages/core/src/types/AbimongoConfig.ts:16](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L16)

#### Overrides

`LoggerConfig.formatOptions`

***

### garbageCollector?

> `optional` **garbageCollector**: `object`

Defined in: packages/logger/dist/types/abimongoConfig.d.ts:27

#### enabled?

> `optional` **enabled**: `boolean`

#### logResults?

> `optional` **logResults**: `boolean`

#### retentionPeriod?

> `optional` **retentionPeriod**: `number`

#### Inherited from

`LoggerConfig.garbageCollector`

***

### hooks?

> `optional` **hooks**: `LoggerHooks`

Defined in: [packages/core/src/types/AbimongoConfig.ts:18](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L18)

#### Overrides

`LoggerConfig.hooks`

***

### json?

> `optional` **json**: `boolean`

Defined in: [packages/core/src/types/AbimongoConfig.ts:15](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L15)

#### Overrides

`LoggerConfig.json`

***

### level?

> `optional` **level**: `LogLevel`

Defined in: packages/logger/dist/types/abimongoConfig.d.ts:17

#### Inherited from

`LoggerConfig.level`

***

### logger?

> `optional` **logger**: `ILogger`

Defined in: [packages/core/src/types/AbimongoConfig.ts:10](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L10)

#### Overrides

`LoggerConfig.logger`

***

### logLevel?

> `optional` **logLevel**: `LogLevel`

Defined in: [packages/core/src/types/AbimongoConfig.ts:11](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L11)

***

### shouldLog()?

> `optional` **shouldLog**: (`level`, `meta?`) => `boolean`

Defined in: [packages/core/src/types/AbimongoConfig.ts:21](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L21)

#### Parameters

##### level

`LogLevel`

##### meta?

`Record`\<`string`, `any`\>

#### Returns

`boolean`

#### Overrides

`LoggerConfig.shouldLog`

***

### transports?

> `optional` **transports**: (`Transporter` \| `RemoteTransporter`)[]

Defined in: [packages/core/src/types/AbimongoConfig.ts:14](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L14)

#### Overrides

`LoggerConfig.transports`

***

### useColor?

> `optional` **useColor**: `boolean`

Defined in: [packages/core/src/types/AbimongoConfig.ts:12](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/types/AbimongoConfig.ts#L12)
