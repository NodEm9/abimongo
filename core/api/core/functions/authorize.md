# Function: authorize()

> **authorize**(`roles`): (`req`, `res`, `next`) => `Response` \| \{ `_id`: `string`; `role`: `string`; `tenantId`: `string`; \} \| `undefined`

Defined in: [core/src/middleware/authorization/auth.ts:17](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/middleware/authorization/auth.ts#L17)

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
