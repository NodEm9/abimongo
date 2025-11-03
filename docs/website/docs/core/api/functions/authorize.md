[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / authorize

# Function: authorize()

> **authorize**(`roles`): (`req`, `res`, `next`) => `Response` \| \{ `_id`: `string`; `role`: `string`; `tenantId`: `string`; \} \| `undefined`

Defined in: [core/src/middleware/authorization/auth.ts:17](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/middleware/authorization/auth.ts#L17)

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
