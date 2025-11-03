[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / initializeGraphQL

# Function: initializeGraphQL()

> **initializeGraphQL**(`customTypeDefs`, `customResolvers`): `Promise`\<`any`\>

Defined in: [core/src/graphql/initializeGraphQL.ts:12](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/graphql/initializeGraphQL.ts#L12)

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
