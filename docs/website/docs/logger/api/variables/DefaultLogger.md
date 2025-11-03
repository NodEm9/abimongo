[**@abimongo/logger**](../README.md)

***

# Variable: DefaultLogger

> `const` **DefaultLogger**: `object`

Defined in: [logger/defaultLogger.ts:3](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/logger/src/logger/defaultLogger.ts#L3)

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
