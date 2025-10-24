# Function: ensureModelNameSafe()

> **ensureModelNameSafe**(`modelName`): `string`

Defined in: packages/core/src/utils/ensureModelNameSafe.ts:13

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
