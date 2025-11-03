[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / GCSettings

# Function: GCSettings()

> **GCSettings**(`config`): `ClassDecorator`

Defined in: [core/src/decorators/gcSettings.ts:19](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/decorators/gcSettings.ts#L19)

## Parameters

### config

`GCConfig`

## Returns

`ClassDecorator`

## Example

```ts
@GCSettings({ ttl: 3600 }) // 1 hour TTL
class MyEntity {}