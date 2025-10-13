[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / initializeGraphQL

# Function: initializeGraphQL()

> **initializeGraphQL**(`customTypeDefs`, `customResolvers`): `Promise`\<`any`\>

Defined in: [src/graphql/initializeGraphQL.ts:12](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/graphql/initializeGraphQL.ts#L12)

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
