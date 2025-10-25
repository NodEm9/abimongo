# AbimongoGraphQL — Generate GraphQL schemas from MongoDB collections

`AbimongoGraphQL` (package: `@abimongo/core`) simplifies building a GraphQL API on top of MongoDB collections. It ships with sensible defaults (types, resolvers, RBAC hooks and subscription plumbing) and lets you extend or override behavior with custom type definitions and resolvers.

---

## Key features

- Flexible schema generation with default types and resolvers
- Add custom type definitions via method chaining
- Extend or override resolvers with custom logic
- Built-in RBAC enforcement via `enforceRBAC` middleware
- Redis-backed real-time subscriptions for DB change events
- Multi-tenant awareness (tenant filtering & tenant-scoped DB access)
- Integrated event logging for operations

---

## Creating an instance

```ts
const graphql = new AbimongoGraphQL(options?: AbimongoGraphQLOptions)
```

Options (common):

- `useRedis?: boolean` — enable Redis for subscriptions (default: `true`)
- `customTypeDefs?: string | string[]` — initial custom GraphQL type definitions
- `customResolvers?: Record<string, any>` — initial custom resolvers

---

## Primary API

### customTypeDefs(typeDefs)

Add one or more custom GraphQL type definitions. Uses method chaining.

```ts
customTypeDefs(typeDefs: string | string[]): AbimongoGraphQL
```

Example:

```ts
graphql
  .customTypeDefs(`
    type Product { id: ID!, name: String!, price: Float }
    extend type Query { products: [Product] }
  `)
  .customTypeDefs([
    `type Category { id: ID!, name: String! }`,
    `extend type Query { categories: [Category] }`
  ]);
```

---

### customResolvers(resolvers)

Merge or register custom resolvers. Incoming resolvers are merged with defaults so you can extend behavior selectively.

```ts
customResolvers(resolvers: Record<string, any>): AbimongoGraphQL
```

Example:

```ts
graphql.customResolvers({
  Query: {
    products: async (_, args, context) => {
      const db = await getTenantDB(context.user.tenantId);
      return db.collection('products').find({ tenantId: context.user.tenantId }).toArray();
    }
  }
});
```

---

### generateSchema(model?)

Builds an executable GraphQL schema (typeDefs + resolvers). If you pass a model or collection hint the generated resolvers will be tailored to that collection by default.

```ts
async generateSchema(model?: any): Promise<GraphQLSchema>
```

Example (Apollo Server):

```ts
const schema = await graphql.generateSchema();
const server = new ApolloServer({ schema, context: ({ req }) => ({
  user: { role: req.user?.role || 'guest', tenantId: req.headers['x-tenant-id'] || 'default' },
  collection: 'users'
})});
```

---

## Default schema overview

The library provides a compact default schema that works for common collection operations and subscriptions.

Types (example):

```graphql
type Document {
  _id: ID!
  name: String
  email: String
  tenantId: String
}

scalar JSON
```

Queries (example):

```graphql
type Query {
  findOne(collection: String!, id: ID!): Document
  findAll(collection: String!): [Document]
}
```

Mutations (example):

```graphql
type Mutation {
  insertOne(collection: String!, data: JSON!): Document
  updateOne(collection: String!, id: ID!, data: JSON!): Document
  deleteOne(collection: String!, id: ID!): Boolean
}
```

Subscriptions (example):

```graphql
type Subscription {
  documentInserted(collection: String!): Document
  documentUpdated(collection: String!): Document
  documentDeleted(collection: String!): ID
}
```

---

## RBAC integration

Default resolvers are wrapped with `enforceRBAC` which checks the caller's role/permissions and throws when access is denied. Example from the implementation:

```ts
findOne: enforceRBAC(async (_, { collection, id }, context) => {
  const db = await getTenantDB(context.user.tenantId);
  return db.collection(collection).findOne({ _id: new ObjectId(id), tenantId: context.user.tenantId });
}, 'read')
```

Required context shape (common):

```ts
interface UserContext {
  user: { role: Role; tenantId: string }
  collection?: string
}
```

---

## Subscriptions (real-time updates)

When enabled, mutations publish events to Redis channels and GraphQL subscriptions are resolved from Redis pub/sub. Mutations call a publish helper such as `publishEvent(channel, payload)` internally.

Example subscription usage:

```graphql
subscription {
  documentInserted(collection: "users") { _id name email tenantId }
}
```

Notes:

- Subscriptions require a running Redis instance if `useRedis` is enabled.
- The subscription channel naming follows the internal `DB_CHANGE_EVENT` prefix plus the collection name.

---

## Multi-tenant behavior

- All default resolvers automatically filter by `tenantId` using the tenant value from context.
- Tenant-specific database access is provided by `getTenantDB(context.user.tenantId)`.
- Cache invalidation is emitted on mutations so tenant caches stay consistent.

---

## Event logging & observability

Default mutation/resolver paths emit concise event logs. Example:

```ts
console.log('create', `[insertOne] Document inserted in ${collection}`, 'info', { tenantId: context.user.tenantId });
```

---

## Error handling & operational notes

- Redis connection failures are surfaced but handled so the server remains functional for non-subscription operations.
- RBAC denies throw explicit errors for unauthorized access.
- Tenant isolation prevents cross-tenant reads/writes.

---

## Example: Full setup (compact)

```ts
import { AbimongoGraphQL } from 'abimongo_core';
import { ApolloServer } from '@apollo/server';

const graphql = new AbimongoGraphQL({ useRedis: true })
  .customTypeDefs(`
    type User { id: ID!, name: String!, email: String!, role: String! }
    extend type Query { currentUser: User }
  `)
  .customResolvers({
    Query: {
      currentUser: enforceRBAC(async (_, args, context) => {
        const db = await getTenantDB(context.user.tenantId);
        return db.collection('users').findOne({ tenantId: context.user.tenantId, role: context.user.role });
      }, 'read:own')
    }
  });

const schema = await graphql.generateSchema();
const server = new ApolloServer({ schema, context: ({ req }) => ({ user: { role: req.user?.role || 'guest', tenantId: req.headers['x-tenant-id'] || 'default' }, collection: 'users' }) });
const { url } = await startStandaloneServer(server, { port: 4000 });
console.log(`GraphQL server running at ${url}`);
```

---

## Important notes

- Redis is required for subscriptions when `useRedis` is enabled.
- Ensure the GraphQL context includes a `user` object with `role` and `tenantId`.
- Default resolvers enforce RBAC and tenant isolation — override with caution.

---

## Next steps & links

- Read [RBAC Middleware](./rbac.md) for advanced permission configuration.
- See [Multi-Tenancy](../core-concepts/MultiTenancy.md) for tenant management patterns.
- Check [Redis Integration](./redis.md) for subscription setup guidance.
