# AbimongoGraphQL: Auto-Generate GraphQL Schemas

The `AbimongoGraphQL` class in **Abimongo_Core** is designed to simplify the process of generating GraphQL schemas for MongoDB collections. It provides a flexible way to create GraphQL APIs with built-in support for multi-tenancy, RBAC, and real-time subscriptions.

---

## Key Features

- **Flexible Schema Generation**: Generate GraphQL schemas with default type definitions and resolvers
- **Custom Type Definitions**: Add custom GraphQL type definitions through method chaining
- **Custom Resolvers**: Extend or override default resolvers with custom logic
- **RBAC Integration**: Built-in role-based access control with `enforceRBAC` middleware
- **Real-time Subscriptions**: Redis-based subscriptions for document changes
- **Multi-Tenant Support**: Automatic tenant isolation in queries and mutations
- **Event Logging**: Integrated logging for GraphQL operations

---

## Constructor

```typescript
const graphql = new AbimongoGraphQL(options?: AbimongoGraphQLOptions)
```

### Options

- `useRedis` (boolean): Enable/disable Redis for subscriptions. Defaults to `true`
- `customTypeDefs` (string[]): Initial custom type definitions
- `customResolvers` (any[]): Initial custom resolvers

---

## Core Methods

### 1. `customTypeDefs(schema)`

Add custom GraphQL type definitions using method chaining.

```typescript
customTypeDefs(schema: string | string[]): AbimongoGraphQL
```

#### Example

```typescript
const graphql = new AbimongoGraphQL()
  .customTypeDefs(`
    type Product {
      id: ID!
      name: String!
      price: Float!
    }
    
    extend type Query {
      products: [Product]
    }
  `)
  .customTypeDefs([
    `type Category { id: ID!, name: String! }`,
    `extend type Query { categories: [Category] }`
  ]);
```

---

### 2. `customResolvers(resolver)`

Add custom resolvers using method chaining.

```typescript
customResolvers(resolver: any): AbimongoGraphQL
```

#### Example

```typescript
const customResolvers = {
  Query: {
    products: async (_, args, context) => {
      const db = await getTenantDB(context.user.tenantId);
      return db.collection('products').find({ tenantId: context.user.tenantId }).toArray();
    }
  }
};

const graphql = new AbimongoGraphQL()
  .customResolvers(customResolvers);
```

---

### 3. `generateSchema(model?)`

Generate the executable GraphQL schema.

```typescript
async generateSchema(model?: any): Promise<GraphQLSchema>
```

#### Example

```typescript
const schema = await graphql.generateSchema();

// Use with Apollo Server
const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    user: { role: req.user?.role || 'guest', tenantId: req.headers['x-tenant-id'] || 'default' },
    collection: 'users'
  })
});
```

---

## Default Schema

The class provides a comprehensive default schema:

### Types

```graphql
type Document {
  _id: ID!
  name: String
  email: String
  tenantId: String
}

scalar JSON
```

### Queries

```graphql
type Query {
  findOne(collection: String!, id: ID!): Document
  findAll(collection: String!): [Document]
}
```

### Mutations

```graphql
type Mutation {
  createUser(name: String!, email: String!): Document
  createUserWithTenant(name: String!, email: String!, tenantId: String!): Document
  insertOne(collection: String!, data: JSON!): Document
  updateOne(collection: String!, id: ID!, data: JSON!): Document
  deleteOne(collection: String!, id: ID!): Boolean
}
```

### Subscriptions

```graphql
type Subscription {
  documentInserted(collection: String!): Document
  documentUpdated(collection: String!): Document
  documentDeleted(collection: String!): ID
}
```

---

## RBAC Integration

All default resolvers are wrapped with `enforceRBAC` middleware:

```typescript
// Example from the implementation
findOne: enforceRBAC(async (_, { collection, id }, context) => {
  const db = await getTenantDB(context.user.tenantId);
  return db.collection(collection).findOne({
    _id: new ObjectId(id),
    tenantId: context.user.tenantId
  });
}, 'read')
```

### Required Context

```typescript
interface UserContext {
  user: { 
    role: Role; 
    tenantId: string 
  };
  collection: string;
}
```

---

## Real-time Subscriptions

Subscriptions are powered by Redis pub/sub:

```typescript
// All mutations automatically publish events
await this.publishEvent(`${DB_CHANGE_EVENT}_${collection}`, {
  documentInserted: newDoc
});
```

### Usage Example

```graphql
subscription {
  documentInserted(collection: "users") {
    _id
    name
    email
    tenantId
  }
}
```

---

## Complete Usage Example

```typescript
import { AbimongoGraphQL } from 'abimongo_core';
import { ApolloServer } from '@apollo/server';

// Create GraphQL instance with custom schema
const graphql = new AbimongoGraphQL({ useRedis: true })
  .customTypeDefs(`
    type User {
      id: ID!
      name: String!
      email: String!
      role: String!
    }
    
    extend type Query {
      currentUser: User
    }
  `)
  .customResolvers({
    Query: {
      currentUser: enforceRBAC(async (_, args, context) => {
        const db = await getTenantDB(context.user.tenantId);
        return db.collection('users').findOne({ 
          tenantId: context.user.tenantId,
          role: context.user.role 
        });
      }, 'read:own')
    }
  });

// Generate schema
const schema = await graphql.generateSchema();

// Create Apollo Server
const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    user: {
      role: req.user?.role || 'guest',
      tenantId: req.headers['x-tenant-id'] || 'default'
    },
    collection: 'users'
  })
});

const { url } = await startStandaloneServer(server, { port: 4000 });
console.log(`GraphQL server running at ${url}`);
```

---

## Multi-Tenant Features

- **Automatic tenant filtering**: All queries include `tenantId` filtering
- **Tenant context**: Uses `getTenantDB()` for tenant-specific database connections
- **Cache invalidation**: Automatic tenant cache invalidation after mutations

---

## Event Logging

All operations include automatic event logging:

```typescript
// Automatic logging for all mutations
console.log('create', `[insertOne] Document inserted in ${collection}`, 'info', { 
  tenantId: context.user.tenantId 
});
```

---

## Error Handling

- Redis connection failures are handled gracefully
- Subscriptions require Redis to be enabled
- RBAC unauthorized access throws clear error messages
- Tenant isolation prevents cross-tenant data access

---

## Important Notes

- **Redis dependency**: Subscriptions require Redis to be running
- **Context requirements**: Proper user context with role and tenantId is required
- **Tenant isolation**: All operations are automatically tenant-aware
- **RBAC enforcement**: All default resolvers enforce role-based permissions

---

## Next Steps

- Explore [RBAC Middleware](./rbac.md) for advanced permission configuration
- Learn about [Multi-Tenancy](../core-concepts/MultiTenancy.md) for tenant management
- Check [Redis Integration](./redis.md) for subscription setup
