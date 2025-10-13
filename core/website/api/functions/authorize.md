[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / authorize

# Function: authorize()

> **authorize**(`roles`): (`req`, `res`, `next`) => `undefined` \| `Response` \| \{ `_id`: `string`; `role`: `string`; `tenantId`: `string`; \}

Defined in: [src/middleware/authorization/auth.ts:17](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/middleware/authorization/auth.ts#L17)

Middleware to authorize access to routes based on user roles.
 This middleware checks if the request contains a valid JWT token,

## Parameters

### roles

`string`[]

An array of roles that are allowed to access the route.

## Returns

> (`req`, `res`, `next`): `undefined` \| `Response` \| \{ `_id`: `string`; `role`: `string`; `tenantId`: `string`; \}

### Parameters

#### req

`Request`

#### res

`Response`

#### next

`NextFunction`

### Returns

`undefined` \| `Response` \| \{ `_id`: `string`; `role`: `string`; `tenantId`: `string`; \}
