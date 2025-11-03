[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / GCSettings

# Function: GCSettings()

> **GCSettings**(`config`): `ClassDecorator`

Defined in: [core/src/decorators/gcSettings.ts:19](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/decorators/gcSettings.ts#L19)

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
