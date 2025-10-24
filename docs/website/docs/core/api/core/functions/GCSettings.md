# Function: GCSettings()

> **GCSettings**(`config`): `ClassDecorator`

Defined in: packages/core/src/decorators/gcSettings.ts:19

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
