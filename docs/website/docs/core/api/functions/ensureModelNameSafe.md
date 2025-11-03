[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / ensureModelNameSafe

# Function: ensureModelNameSafe()

> **ensureModelNameSafe**(`modelName`): `string`

Defined in: [core/src/utils/ensureModelNameSafe.ts:11](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/utils/ensureModelNameSafe.ts#L11)

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
