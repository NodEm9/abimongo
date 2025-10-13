# Abimongo_Core

![NPM Version](https://img.shields.io/npm/v/abimongo_core?link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fabimongo_core%3FactiveTab%3Dreadme) <!-- ![Codecov](https://img.shields.io/codecov/c/github/app.codecov.io%2Fgh%2FNodEm9/abimongo_core?link=https%3A%2F%2Fapp.codecov.io%2Fgh%2FNodEm9%2Fabimongo_core) -->


**Abimongo_Core** is an advanced, enterprise-grade ORM/ODM for MongoDB, built on top of the official MongoDB Node.js driver. It provides a robust and flexible API for managing MongoDB collections, documents, and multi-tenant architectures with ease.

## Features

- **Schema Validation**: Define and enforce schemas for your MongoDB collections.
- **Middleware Support**: Add pre/post hooks for CRUD operations.
- **Multi-Tenancy**: Built-in support for multi-tenant applications with tenant context propagation and lazy loading.
- **Caching**: Redis-based caching for optimized query performance.
- **Transactions**: Simplified transaction management for MongoDB.
- **Aggregation Pipelines**: Advanced query capabilities with aggregation pipelines.
- **Change Streams**: Real-time change tracking for collections.
- **TypeScript Support**: Fully typed API for type safety and better developer experience.
- **GraphQL Integration**: Auto-generate GraphQL schemas and resolvers, with RBAC middleware for secure APIs.
- **CLI Scaffolding**: Quickly scaffold models, schemas, and GraphQL components using the Abimongo_CLI.
- **RBAC Middleware**: Role-based access control for REST and GraphQL endpoints.
- **Plugin System**: Extend core functionality with custom plugins.
- **Bootstrap Utility**: Rapidly initialize new projects with `AbimongoBootstrap`.

---

## Installation

Install the library using npm or yarn:

```bash
npm install @abimongo/core
# or
yarn add @abimongo/core
```

---

## Getting Started

### Basic Usage

```typescript
import { AbimongoModel, AbimongoSchema } from '@abimongo/core';

// Define a schema
const userSchema = new AbimongoSchema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
});

// Create a model
const UserModel = new AbimongoModel({
  collectionName: 'users',
  schema: userSchema,
});

// Perform CRUD operations
(async () => {
  // Create a new user
  const user = await UserModel.create({ name: 'John Doe', email: 'john@example.com', age: 30 });

  // Find users
  const users = await UserModel.find({ age: { $gte: 18 } });

  // Update a user
  await UserModel.updateOne({ email: 'john@example.com' }, { $set: { age: 31 } });

  // Delete a user
  await UserModel.deleteOne({ email: 'john@example.com' });
})();
```

---

## Multi-Tenancy Support

Abimongo_Core provides first-class support for multi-tenant applications. Use the `TenantContext` and `MultiTenantManager` to manage tenant-specific databases and collections.

### Example: Multi-Tenant Setup

```typescript
import { applyMultiTenancy, getTenantModel } from '@abimongo/core';
import express from 'express';

const app = express();

// Define tenants
const tenants = {
  tenant1: 'mongodb://localhost:27017/tenant1',
  tenant2: 'mongodb://localhost:27017/tenant2',
};

// Apply multi-tenancy middleware
applyMultiTenancy(app, tenants, {
  headerKey: 'x-tenant-id', // Header to identify the tenant
  initOptions: {
	lazy: true, // Lazy load connections 
	// Other options here... 
   },
});

// Define routes
app.get('/users', async (req, res) => {
  const UserModel = await getTenantModel({
    modelName: 'User',
    tenantId: tenantId['tenant-a'], // How you may pass a tenant ID
    // You can also pass a schema here. It's optional depend on your use case. 
  });

  const users = await UserModel.find();
  res.json(users);
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## Schema Validation and Middleware

### Schema Validation

Define schemas with validation rules to enforce data integrity.

```typescript
const productSchema = new AbimongoSchema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String },
});
```

### Middleware Hooks

Add pre/post hooks for CRUD operations.

```typescript
productSchema.pre('save', async (doc) => {
  console.log('Before saving:', doc);
});

productSchema.post('save', async (doc) => {
  console.log('After saving:', doc);
});
```

---

## Transactions

Simplify transaction management with built-in support.

```typescript
await UserModel.updateWithTransaction(
  { email: 'john@example.com' },
  { $set: { age: 32 } }
);
```

---

## Caching

Use Redis for caching query results.

```typescript
const cachedUsers = await UserModel.aggregateWithCache(
  [{ $match: { age: { $gte: 18 } } }],
  'users_cache_key',
  300 // Cache duration in seconds
);
```

---

## Change Streams

Track real-time changes in collections.

```typescript
UserModel.watchChanges((change) => {
  console.log('Change detected:', change);
});
```

---

## GraphQL Integration

Abimongo_Core now supports seamless GraphQL integration, including:

- **Auto-generated GraphQL schemas** from your models and schemas.
- **Customizable resolvers** and support for real-time subscriptions.
- **RBAC middleware** for securing GraphQL endpoints.

### Example: Quick GraphQL Setup

```typescript
import { AbimongoSchema, AbimongoModel, AbimongoGraphQL } from '@abimongo/core';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const userSchema = new AbimongoSchema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
});

const UserModel = new AbimongoModel({
  collectionName: 'users',
  schema: userSchema,
});

// This is still experimental, we advice that avoid using it.
const graphqlSchema = AbimongoGraphQL.generateSchema({
  models: [UserModel],
  options: { enableSubscriptions: true },
});

// Instead call it like this without parsing paramenter and it will generate 
// schema out of the box which can use for playgrounds and testing.
const graphqlSchema = AbimongoGraphQL.generateSchema()

// To create customize it, you can call the customResolvers() and customTypeDefs()
// funtion directly like so.
schema.customResolvers(
  // Here you can customize how ever you want either as in above or like this 
  // and the simply call AbimongoGraphQL.generateSchema() afterward where ever 
  // you are using it.
  `
   type Query {
  users: [User]
  user(id: ID!): User
}
type Mutation {
  createUser(name: String!, email: String!, age: Int!): User
  updateUser(id: ID!, name: String, email: String, age: Int): User
  deleteUser(id: ID!): Boolean
}
`,
).customTypeDefs(
`
type User {
  name: String
  email: String
  age: Int
  tenanaId: String
}
 `,
);


const server = new ApolloServer({ schema: graphqlSchema });
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`GraphQL server running at ${url}`);
```

---

## CLI Scaffolding

Accelerate your development with the **Abimongo_CLI**:

- Scaffold models, schemas, and GraphQL components.
- Initialize new projects with best practices.
- Generate multi-tenant and RBAC-ready code.

```bash
npx abimongo my-app-name
```

## Pass Flags

```bash
npx abimongo my-app-name --graphql --multi-tenant --logger
```

When you pass a flag this will enable the feature in the abimongo.config.json config file, if you do not use flags at the time of generating the package then you will have to enable features that your project needs manuelly. 

See the [CLI Scaffolding Guide](docs-site/docs/guides/CLI-Scaffolding.md) for more.

---

## RBAC Middleware

Secure your APIs with built-in Role-Based Access Control:

- Use `enforceRBAC` to wrap REST or GraphQL resolvers.
- Define permissions per role in your configuration.
- Integrates with caching for efficient permission checks.

---

## Plugin System

Extend Abimongo_Core with custom plugins to add new features or modify behavior.

---

## Bootstrap Utility

Quickly initialize new projects with `AbimongoBootstrap`:

- Generates `abimongo.config.json` and recommended folder structure.
- Installs dependencies and creates starter files.

---

## API Reference

### AbimongoModel

- `create(doc: T): Promise<T>`: Creates a new document.
- `find(filter: Filter<T>): Promise<T[]>`: Finds documents matching the filter.
- `updateOne(filter: Filter<T>, update: UpdateFilter<T>): Promise<void>`: Updates a single document.
- `deleteOne(filter: Filter<T>): Promise<void>`: Deletes a single document.
- `aggregate(pipeline: object[]): Promise<T[]>`: Runs an aggregation pipeline.

### TenantContext

- `run(tenantId: string, callback: () => void): void`: Runs a callback within a tenant context.
- `getTenantId(): string | undefined`: Retrieves the current tenant ID.

### MultiTenantManager

- `registerTenant(tenantId: string, uri: string): Promise<MongoClient>`: Registers a tenant with a MongoDB URI.
- `getClient(tenantId: string): Promise<MongoClient | null>`: Retrieves the MongoClient for a tenant.

### AbimongoGraphQL

- `generateSchema({ models, options })`: Auto-generates a GraphQL schema from your models.

### RBAC

- `enforceRBAC(resolver, action)`: Wraps a resolver with RBAC enforcement.
- `getRBACAction(resolver)`: Retrieves the RBAC action for a resolver.
- `getOriginalResolver(resolver)`: Retrieves the original resolver.

---

## Contributing

We welcome contributions! Please follow the [contribution guidelines](CONTRIBUTING.md) to get started.

---

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/NodEm9/abimongo_core?tab=MIT-ov-file) file for details.

---

## Support

For questions or support, please open an issue on the [GitHub repository](https://github.com/NodEm9/abimongo_core/issues).

---

## Acknowledgments

Special thanks to the MongoDB Node.js driver team and the open-source community for their excellent work.

