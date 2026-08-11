# Multi-Tenancy

## Overview

Abimongo provides built-in support for multi-tenant architectures.

It allows applications to dynamically resolve:

- database connections
- MongoDB clients
- collection targets

based on tenant context.

## Supported patterns

### Tenant per Database

Each tenant has its own database:

```text
tenantA → dbA
tenantB → dbB
```

### Tenant per Client

Each tenant uses a separate MongoDB client:

```text
tenantA → MongoClient A
tenantB → MongoClient B
```

### Register tenants

```ts
await initMultiTenancy({
  tenantA: 'mongodb://localhost:27017/dbA',
  tenantB: 'mongodb://localhost:27017/dbB'
});
```

### Using tenant context

```ts
await AbimongoContext.run(
  { tenantId: 'tenantA' },
  async () => {
    await UserModel.find({});
  }
);
```

### How resolution works

When executing a query:

- Abimongo reads `tenantId` from context
- resolves the corresponding client
- selects the appropriate database
- executes the operation

### Model-level tenant binding

```ts
const tenantModel = UserModel.bind({
  tenantId: 'tenantA'
});
```

### Error handling

If a tenant is not registered:

- Tenant "tenantA" is not registered.

### Lazy initialization

Tenants can be resolved lazily:

- improves startup performance
- reduces unnecessary connections

## Best practices

- always set `tenantId` via context
- avoid hardcoding tenant logic
- isolate tenant data completely

## Use cases

- SaaS platforms
- multi-organization systems
- white-label applications
