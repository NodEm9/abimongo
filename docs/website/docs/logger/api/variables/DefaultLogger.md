[**@abimongo/logger**](../README.md)

***

# Variable: DefaultLogger

> `const` **DefaultLogger**: `object`

Defined in: [logger/defaultLogger.ts:4](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/logger/src/logger/defaultLogger.ts#L4)

## Type Declaration

### debug()

> **debug**: (...`args`) => `void`

#### Parameters

##### args

...`any`[]

#### Returns

`void`

### error()

> **error**: (...`args`) => `void`

#### Parameters

##### args

...`any`[]

#### Returns

`void`

### fatal()

> **fatal**: (...`args`) => `void`

#### Parameters

##### args

...`any`[]

#### Returns

`void`

### info()

> **info**: (...`args`) => `void`

#### Parameters

##### args

...`any`[]

#### Returns

`void`

### log()

> **log**: (`level`, `message`, `meta?`) => `void`

#### Parameters

##### level

[`LogLevel`](../type-aliases/LogLevel.md)

##### message

`string`

##### meta?

[`LogMeta`](../interfaces/LogMeta.md)

#### Returns

`void`

### trace()

> **trace**: (...`args`) => `void`

#### Parameters

##### args

...`any`[]

#### Returns

`void`

### warn()

> **warn**: (...`args`) => `void`

#### Parameters

##### args

...`any`[]

#### Returns

`void`
