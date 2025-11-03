[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / authorize

# Function: authorize()

> **authorize**(`roles`): (`req`, `res`, `next`) => `Response` \| \{ `_id`: `string`; `role`: `string`; `tenantId`: `string`; \} \| `undefined`

Defined in: [core/src/middleware/authorization/auth.ts:17](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/middleware/authorization/auth.ts#L17)

Middleware to authorize access to routes based on user roles.
 This middleware checks if the request contains a valid JWT token,

## Parameters

### roles

`string`[]

An array of roles that are allowed to access the route.

## Returns

> (`req`, `res`, `next`): `Response` \| \{ `_id`: `string`; `role`: `string`; `tenantId`: `string`; \} \| `undefined`

### Parameters

#### req

`Request`

#### res

`Response`

#### next

`NextFunction`

### Returns

`Response` \| \{ `_id`: `string`; `role`: `string`; `tenantId`: `string`; \} \| `undefined`
