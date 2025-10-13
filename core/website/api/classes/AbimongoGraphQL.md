[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoGraphQL

# Class: AbimongoGraphQL

Defined in: [src/graphql/AbimongoGraphQL.ts:34](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/graphql/AbimongoGraphQL.ts#L34)

AbimongoGraphQL class provides a way to create a GraphQL schema
with custom type definitions and resolvers, while integrating
with Redis for real-time subscriptions and caching.
It supports multi-tenancy and role-based access control (RBAC).
 AbimongoGraphQL

## Param

Configuration options for the GraphQL instance.

## Constructors

### Constructor

> **new AbimongoGraphQL**(`options`): `AbimongoGraphQL`

Defined in: [src/graphql/AbimongoGraphQL.ts:42](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/graphql/AbimongoGraphQL.ts#L42)

#### Parameters

##### options

[`AbimongoGraphQLOptions`](../interfaces/AbimongoGraphQLOptions.md) = `{}`

#### Returns

`AbimongoGraphQL`

## Methods

### customResolvers()

> **customResolvers**(`resolver`): `AbimongoGraphQL`

Defined in: [src/graphql/AbimongoGraphQL.ts:63](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/graphql/AbimongoGraphQL.ts#L63)

Add custom resolvers (will be merged)

#### Parameters

##### resolver

`any`

#### Returns

`AbimongoGraphQL`

***

### customTypeDefs()

> **customTypeDefs**(`schema`): `AbimongoGraphQL`

Defined in: [src/graphql/AbimongoGraphQL.ts:51](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/graphql/AbimongoGraphQL.ts#L51)

Add custom typeDefs (string or SDL array)

#### Parameters

##### schema

`string` | `string`[]

#### Returns

`AbimongoGraphQL`

***

### generateSchema()

> **generateSchema**(`model?`): `Promise`\<`GraphQLSchema`\>

Defined in: [src/graphql/AbimongoGraphQL.ts:303](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/graphql/AbimongoGraphQL.ts#L303)

Dynamically generate GraphQL Schema

#### Parameters

##### model?

`any`

#### Returns

`Promise`\<`GraphQLSchema`\>
