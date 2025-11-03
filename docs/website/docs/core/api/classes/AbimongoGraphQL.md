[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoGraphQL

# Class: AbimongoGraphQL

Defined in: [core/src/graphql/AbimongoGraphQL.ts:33](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/graphql/AbimongoGraphQL.ts#L33)

AbimongoGraphQL provides GraphQL schema generation with Redis integration and RBAC support.
 AbimongoGraphQL

## Remarks

Supports multi-tenancy and realtime subscriptions via Redis.

## Example

```ts
const graphql = new AbimongoGraphQL({ useRedis: true });
```

## Constructors

### Constructor

> **new AbimongoGraphQL**(`options`): `AbimongoGraphQL`

Defined in: [core/src/graphql/AbimongoGraphQL.ts:41](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/graphql/AbimongoGraphQL.ts#L41)

#### Parameters

##### options

[`AbimongoGraphQLOptions`](../interfaces/AbimongoGraphQLOptions.md) = `{}`

#### Returns

`AbimongoGraphQL`

## Methods

### customResolvers()

> **customResolvers**(`resolver`): `AbimongoGraphQL`

Defined in: [core/src/graphql/AbimongoGraphQL.ts:62](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/graphql/AbimongoGraphQL.ts#L62)

Add custom resolvers (will be merged)

#### Parameters

##### resolver

`any`

#### Returns

`AbimongoGraphQL`

***

### customTypeDefs()

> **customTypeDefs**(`schema`): `AbimongoGraphQL`

Defined in: [core/src/graphql/AbimongoGraphQL.ts:50](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/graphql/AbimongoGraphQL.ts#L50)

Add custom typeDefs (string or SDL array)

#### Parameters

##### schema

`string` | `string`[]

#### Returns

`AbimongoGraphQL`

***

### generateSchema()

> **generateSchema**(`model?`, `enableSubscriptions?`): `Promise`\<`GraphQLSchema`\>

Defined in: [core/src/graphql/AbimongoGraphQL.ts:306](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/graphql/AbimongoGraphQL.ts#L306)

Dynamically generate GraphQL Schema

#### Parameters

##### model?

`any`

##### enableSubscriptions?

`boolean`

#### Returns

`Promise`\<`GraphQLSchema`\>

***

### subscriptions()

> **subscriptions**(): `boolean`

Defined in: [core/src/graphql/AbimongoGraphQL.ts:299](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/graphql/AbimongoGraphQL.ts#L299)

#### Returns

`boolean`
