# Function: initializeGraphQL()

> **initializeGraphQL**(`customTypeDefs`, `customResolvers`): `Promise`\<`any`\>

Defined in: [core/src/graphql/initializeGraphQL.ts:12](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/graphql/initializeGraphQL.ts#L12)

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
