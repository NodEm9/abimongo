# Frequently Asked Questions (FAQ)

This FAQ addresses common questions and concerns developers may have when using **Abimongo_Core**. If your question is not answered here, feel free to open an issue on the [GitHub repository](https://github.com/NodEm9/abimongo_core/issues).

---

## General Questions

### 1. **What is Abimongo_Core?**

Abimongo_Core is an enterprise-grade ORM/ODM for MongoDB. It provides advanced features like schema validation, multi-tenancy, caching, GraphQL integration, and more, making it easier to build scalable and maintainable applications.

---

### 2. **What are the key features of Abimongo_Core?**

- Schema validation and middleware hooks.
- Multi-tenancy support for tenant-specific databases.
- Redis-based caching for optimized performance.
- GraphQL integration with auto-generated schemas and resolvers.
- Real-time updates using MongoDB Change Streams.
- Transaction support for atomic operations.

---

### 3. **Is Abimongo_Core compatible with TypeScript?**

Yes, Abimongo_Core is fully compatible with TypeScript. It provides type definitions for all its components, ensuring type safety and a better developer experience.

---

## Installation and Setup

### 4. **How do I install Abimongo_Core?**

You can install Abimongo_Core using npm or yarn:

```bash
npm install abimongo_core
# or
yarn add abimongo_core
```

---

### 5. **What are the prerequisites for using Abimongo_Core?**

- Node.js (version 14 or higher).
- MongoDB (local or cloud instance).
- Redis (optional, for caching).

---

### 6. **How do I configure Abimongo_Core for my project?**

You can configure Abimongo_Core by defining schemas, models, and database connections. Refer to the [Getting Started Guide](./getting-started/installation.md) for detailed instructions.

---

## Multi-Tenancy

### 7. **How does Abimongo_Core handle multi-tenancy?**

Abimongo_Core provides built-in support for multi-tenancy by isolating data per tenant at the database level. It uses the `TenantContext` and `MultiTenantManager` to manage tenant-specific databases and collections.

---

### 8. **Can I use lazy loading for tenant databases?**

Yes, Abimongo_Core supports lazy loading for tenant databases. You can enable it by setting the `lazy` option to `true` in the multi-tenancy configuration.

---

### 9. **How do I resolve tenant-specific models?**

Use the `getTenantModel` function to dynamically resolve tenant-specific models. Refer to the [Multi-Tenancy Guide](./core-concepts/MultiTenancy.md) for examples.

---

## Caching

### 10. **Does Abimongo_Core support caching?**

Yes, Abimongo_Core provides Redis-based caching to optimize query performance. You can use methods like `findCached`, `cacheResult`, and `aggregateWithCache` to manage cached data.

---

### 11. **How do I clear cached data?**

You can use the `clearCache` method to invalidate cached data by its key:

```typescript
await AbimongoModel.clearCache('cache_key');
```

---

## GraphQL Integration

### 12. **How does Abimongo_Core integrate with GraphQL?**

Abimongo_Core provides the `AbimongoGraphQL` class to auto-generate GraphQL schemas, resolvers, and subscriptions based on MongoDB models. It simplifies the process of building GraphQL APIs.

---

### 13. **Can I customize GraphQL resolvers?**

Yes, you can provide custom resolvers using the `customResolvers` option in the `AbimongoGraphQL.generateSchema` method.

---

### 14. **Does Abimongo_Core support GraphQL subscriptions?**

Yes, Abimongo_Core supports real-time updates using GraphQL subscriptions. You can enable subscriptions by setting the `enableSubscriptions` option to `true`.

---

## Transactions

### 15. **Does Abimongo_Core support MongoDB transactions?**

Yes, Abimongo_Core provides built-in support for MongoDB transactions. You can use methods like `updateWithTransaction` and `deleteWithTransaction` to perform atomic operations.

---

### 16. **How do I use transactions in a multi-tenant setup?**

Transactions are supported in multi-tenant setups. Ensure that the tenant-specific database connection is used when starting a transaction.

---

## Error Handling and Debugging

### 17. **How does Abimongo_Core handle errors?**

Abimongo_Core provides detailed error messages for common issues like schema validation failures, unauthorized actions, and database connection errors. You can also use custom error handlers.

---

### 18. **How do I debug issues in Abimongo_Core?**

Enable logging in your configuration to debug issues. For example:

```typescript
const config = {
  logger: {
    info: (msg) => console.log(msg),
    warn: (msg) => console.warn(msg),
    error: (msg) => console.error(msg),
  },
};
```

---

## Performance

### 19. **How does Abimongo_Core optimize performance?**

- Uses Redis for caching frequently accessed data.
- Supports connection pooling for MongoDB.
- Provides lazy loading for tenant databases to reduce initial overhead.

---

### 20. **Can I monitor MongoDB connections?**

Yes, you can monitor MongoDB connections using the `getClusterInfo` method in the `AbimongoClient` class.

---

## Miscellaneous

### 21. **Is Abimongo_Core suitable for large-scale applications?**

Yes, Abimongo_Core is designed for enterprise-grade applications. Its features like multi-tenancy, caching, and transaction support make it suitable for large-scale use cases.

---

### 22. **Can I use Abimongo_Core with other ORMs/ODMs?**

While Abimongo_Core is a standalone library, you can use it alongside other ORMs/ODMs if needed. However, it is recommended to use Abimongo_Core exclusively for MongoDB operations to avoid conflicts.

---

### 23. **Does Abimongo_Core support custom plugins?**

Yes, you can extend Abimongo_Core functionality by creating custom plugins. 
<!-- Refer to the [Plugin Guide](../api/plugins.md) for more details. -->
 
---

## Support

If you have additional questions or need support, please open an issue on the [GitHub repository](https://github.com/your-repo/abimongo_core_library).
