# Function: GCSettings()

> **GCSettings**(`config`): `ClassDecorator`

Defined in: [core/src/decorators/gcSettings.ts:19](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/decorators/gcSettings.ts#L19)

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
