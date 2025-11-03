# Class: AuthService

Defined in: [core/src/utils/AuthUtils.ts:10](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/utils/AuthUtils.ts#L10)

## Constructors

### Constructor

> **new AuthService**(): `AuthService`

#### Returns

`AuthService`

## Methods

### generateRefreshToken()

> `static` **generateRefreshToken**(`user`): `string`

Defined in: [core/src/utils/AuthUtils.ts:17](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/utils/AuthUtils.ts#L17)

#### Parameters

##### user

###### _id

`string`

###### role

`string`

#### Returns

`string`

***

### generateToken()

> `static` **generateToken**(`user`): `string`

Defined in: [core/src/utils/AuthUtils.ts:11](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/utils/AuthUtils.ts#L11)

#### Parameters

##### user

###### _id

`string`

###### role

`string`

###### tenantId

`string`

#### Returns

`string`

***

### verifyToken()

> `static` **verifyToken**(`token`): `string` \| `JwtPayload`

Defined in: [core/src/utils/AuthUtils.ts:26](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/utils/AuthUtils.ts#L26)

#### Parameters

##### token

`string`

#### Returns

`string` \| `JwtPayload`
