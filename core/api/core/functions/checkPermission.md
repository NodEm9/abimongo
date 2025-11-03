# Function: checkPermission()

> **checkPermission**(`role`, `permission`): `Promise`\<`boolean`\>

Defined in: [core/src/middleware/rbac/rbacMiddleware.ts:28](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/middleware/rbac/rbacMiddleware.ts#L28)

Check if a user has a specific permission

## Parameters

### role

[`Role`](../type-aliases/Role.md)

The role of the user

### permission

[`Permission`](../type-aliases/Permission.md)

The permission to check

## Returns

`Promise`\<`boolean`\>

A promise that resolves to true if the user has the permission, false otherwise

## Example

```ts
const hasPermission = await checkPermission('admin', 'createUser');
if (hasPermission) {
// User has permission to create a user
} else {
// User does not have permission to create a user
}
```
