[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / GCSettings

# Function: GCSettings()

> **GCSettings**(`config`): `ClassDecorator`

Defined in: [core/src/decorators/gcSettings.ts:19](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/decorators/gcSettings.ts#L19)

## Parameters

### config

`GCConfig`

## Returns

`ClassDecorator`

## Example

```ts
@GCSettings({ ttl: 3600 }) // 1 hour TTL
class MyEntity {}