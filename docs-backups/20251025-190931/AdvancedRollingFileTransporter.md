[**@abimongo_utils/logger v1.4.6**](../README.md)

***

[@abimongo_utils/logger](../README.md) / AdvancedRollingFileTransporter

# Class: AdvancedRollingFileTransporter

Defined in: [transports/AdvancedRollingFileTransporter.ts:21](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/AdvancedRollingFileTransporter.ts#L21)

## Constructors

### Constructor

> **new AdvancedRollingFileTransporter**(`options`): `AdvancedRollingFileTransporter`

Defined in: [transports/AdvancedRollingFileTransporter.ts:28](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/AdvancedRollingFileTransporter.ts#L28)

#### Parameters

##### options

`RollingFileOptions`

#### Returns

`AdvancedRollingFileTransporter`

## Methods

### close()

> **close**(): `void`

Defined in: [transports/AdvancedRollingFileTransporter.ts:155](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/AdvancedRollingFileTransporter.ts#L155)

#### Returns

`void`

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [transports/AdvancedRollingFileTransporter.ts:130](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/AdvancedRollingFileTransporter.ts#L130)

#### Returns

`Promise`\<`void`\>

***

### write()

> **write**(`message`, `_level?`): `Promise`\<`void`\>

Defined in: [transports/AdvancedRollingFileTransporter.ts:123](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/AdvancedRollingFileTransporter.ts#L123)

#### Parameters

##### message

`string`

##### \_level?

[`LogLevel`](../type-aliases/LogLevel.md)

#### Returns

`Promise`\<`void`\>
