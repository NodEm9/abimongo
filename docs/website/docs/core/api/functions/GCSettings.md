[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / GCSettings

# Function: GCSettings()

> **GCSettings**(`config`): `ClassDecorator`

Defined in: [core/src/decorators/gcSettings.ts:19](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/decorators/gcSettings.ts#L19)

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
