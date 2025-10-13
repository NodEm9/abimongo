[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / checkPermission

# Function: checkPermission()

> **checkPermission**(`role`, `permission`): `Promise`\<`boolean`\>

Defined in: [src/middleware/rbac/rbacMiddleware.ts:28](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/middleware/rbac/rbacMiddleware.ts#L28)

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
