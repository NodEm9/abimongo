[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / GCSettings

# Function: GCSettings()

> **GCSettings**(`config`): `ClassDecorator`

Defined in: [packages/core/src/decorators/gcSettings.ts:19](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/decorators/gcSettings.ts#L19)

## Parameters

### config

`GCConfig`

## Returns

`ClassDecorator`

## Example

```ts
@GCSettings({ ttl: 3600 }) // 1 hour TTL
class MyEntity {}
```
