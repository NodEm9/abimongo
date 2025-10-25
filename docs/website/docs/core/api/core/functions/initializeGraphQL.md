# Function: initializeGraphQL()

> **initializeGraphQL**(`customTypeDefs`, `customResolvers`): `Promise`\<`any`\>

Defined in: packages/core/src/graphql/initializeGraphQL.ts:12

Initializes GraphQL with optional custom type definitions and resolvers.
Sets up Redis subscription for GraphQL messages.

## Parameters

### customTypeDefs

`string` = `""`

Optional custom GraphQL type definitions.

### customResolvers

`any` = `{}`

Optional custom GraphQL resolvers.

## Returns

`Promise`\<`any`\>

The generated GraphQL schema.
