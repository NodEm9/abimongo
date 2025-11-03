[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / initializeGraphQL

# Function: initializeGraphQL()

> **initializeGraphQL**(`customTypeDefs`, `customResolvers`): `Promise`\<`any`\>

Defined in: [core/src/graphql/initializeGraphQL.ts:12](https://github.com/NodEm9/abimongo/blob/92ef7804233d51622a6ea273a61b19df4330e687/packages/core/src/graphql/initializeGraphQL.ts#L12)

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
