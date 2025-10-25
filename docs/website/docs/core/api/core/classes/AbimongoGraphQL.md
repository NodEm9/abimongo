# Class: AbimongoGraphQL

Defined in: packages/core/src/graphql/AbimongoGraphQL.ts:34

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

Defined in: packages/core/src/graphql/AbimongoGraphQL.ts:42

#### Parameters

##### options

[`AbimongoGraphQLOptions`](../interfaces/AbimongoGraphQLOptions.md) = `{}`

#### Returns

`AbimongoGraphQL`

## Methods

### customResolvers()

> **customResolvers**(`resolver`): `AbimongoGraphQL`

Defined in: packages/core/src/graphql/AbimongoGraphQL.ts:63

Add custom resolvers (will be merged)

#### Parameters

##### resolver

`any`

#### Returns

`AbimongoGraphQL`

***

### customTypeDefs()

> **customTypeDefs**(`schema`): `AbimongoGraphQL`

Defined in: packages/core/src/graphql/AbimongoGraphQL.ts:51

Add custom typeDefs (string or SDL array)

#### Parameters

##### schema

`string` | `string`[]

#### Returns

`AbimongoGraphQL`

***

### generateSchema()

> **generateSchema**(`model?`): `Promise`\<`GraphQLSchema`\>

Defined in: packages/core/src/graphql/AbimongoGraphQL.ts:303

Dynamically generate GraphQL Schema

#### Parameters

##### model?

`any`

#### Returns

`Promise`\<`GraphQLSchema`\>
