# Class: AuthService

Defined in: packages/core/src/utils/AuthUtils.ts:10

## Constructors

### Constructor

> **new AuthService**(): `AuthService`

#### Returns

`AuthService`

## Methods

### generateRefreshToken()

> `static` **generateRefreshToken**(`user`): `string`

Defined in: packages/core/src/utils/AuthUtils.ts:17

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

Defined in: packages/core/src/utils/AuthUtils.ts:11

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

Defined in: packages/core/src/utils/AuthUtils.ts:26

#### Parameters

##### token

`string`

#### Returns

`string` \| `JwtPayload`
