[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / ensureModelNameSafe

# Function: ensureModelNameSafe()

> **ensureModelNameSafe**(`modelName`): `string`

Defined in: [packages/core/src/utils/ensureModelNameSafe.ts:13](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/utils/ensureModelNameSafe.ts#L13)

Ensures that the provided model name is a valid, non-empty string.
Throws an error if the model name is invalid.

## Parameters

### modelName

`string`

The model name to validate.

## Returns

`string`

- The validated model name.

## Throws

- If the model name is invalid.

## Example

```ts
const safeModelName = ensureModelNameSafe('MyModel123');
```
