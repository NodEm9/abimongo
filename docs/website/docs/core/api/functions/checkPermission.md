[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / checkPermission

# Function: checkPermission()

> **checkPermission**(`role`, `permission`): `Promise`\<`boolean`\>

Defined in: [core/src/middleware/rbac/rbacMiddleware.ts:28](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/middleware/rbac/rbacMiddleware.ts#L28)

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