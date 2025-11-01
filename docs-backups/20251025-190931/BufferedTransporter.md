[**@abimongo_utils/logger v1.4.6**](../README.md)

***

[@abimongo_utils/logger](../README.md) / BufferedTransporter

# Class: BufferedTransporter

Defined in: [transports/buffered.transporter.ts:11](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/buffered.transporter.ts#L11)

## Implements

- [`Transporter`](../interfaces/Transporter.md)

## Constructors

### Constructor

> **new BufferedTransporter**(`transporter`, `options?`): `BufferedTransporter`

Defined in: [transports/buffered.transporter.ts:18](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/buffered.transporter.ts#L18)

#### Parameters

##### transporter

[`Transporter`](../interfaces/Transporter.md)

##### options?

###### flushInterval?

`number`

###### flushSize?

`number`

#### Returns

`BufferedTransporter`

## Methods

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [transports/buffered.transporter.ts:43](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/buffered.transporter.ts#L43)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Transporter`](../interfaces/Transporter.md).[`flush`](../interfaces/Transporter.md#flush)

***

### stop()

> **stop**(): `void`

Defined in: [transports/buffered.transporter.ts:64](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/buffered.transporter.ts#L64)

#### Returns

`void`

***

### write()

> **write**(`message`, `level?`, `meta?`): `Promise`\<`void`\>

Defined in: [transports/buffered.transporter.ts:29](https://github.com/NodEm9/abimongo_utils/blob/44bde4aba239181e6f4030255b47a0bd30e0063b/logger/src/transports/buffered.transporter.ts#L29)

#### Parameters

##### message

`string`

##### level?

`string`

##### meta?

`any`[]

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Transporter`](../interfaces/Transporter.md).[`write`](../interfaces/Transporter.md#write)
