[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / AuthService

# Class: AuthService

Defined in: [core/src/utils/AuthUtils.ts:10](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/utils/AuthUtils.ts#L10)

## Constructors

### Constructor

> **new AuthService**(): `AuthService`

#### Returns

`AuthService`

## Methods

### generateRefreshToken()

> `static` **generateRefreshToken**(`user`): `string`

Defined in: [core/src/utils/AuthUtils.ts:17](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/utils/AuthUtils.ts#L17)

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

Defined in: [core/src/utils/AuthUtils.ts:11](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/utils/AuthUtils.ts#L11)

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

Defined in: [core/src/utils/AuthUtils.ts:26](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/utils/AuthUtils.ts#L26)

#### Parameters

##### token

`string`

#### Returns

`string` \| `JwtPayload`
