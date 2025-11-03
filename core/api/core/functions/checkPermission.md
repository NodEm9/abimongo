# Function: checkPermission()

> **checkPermission**(`role`, `permission`): `Promise`\<`boolean`\>

Defined in: [core/src/middleware/rbac/rbacMiddleware.ts:28](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/middleware/rbac/rbacMiddleware.ts#L28)

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
