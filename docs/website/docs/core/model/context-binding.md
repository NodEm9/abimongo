# Context Binding

---

## Overview

Context binding allows you to attach a default execution context to a model. This is useful for multi-tenant applications, scoped database access, and enforcing consistent query behavior.

---

## Basic usage

```ts
const tenantModel = UserModel.bind({
  tenantId: 'tenantA',
  dbName: 'tenant_db'
});

// Now all operations use this context
await tenantModel.find({});
```

## How it works

When you bind a model, a shallow clone is created and the provided default context is merged into future operations.

## Context resolution priority

When executing a query the following priority applies:

1. method-level context
2. bound model context
3. runtime context (`AbimongoContext`)

Example:

```ts
UserModel.bind({ tenantId: 'A' }).find({}, { tenantId: 'B' });
// uses tenantId = 'B'
```

## Combining with runtime context

```ts
await AbimongoContext.run(
  { tenantId: 'runtimeTenant' },
  async () => {
    await UserModel.find({});
  }
);
```

## Binding for multi-tenancy

```ts
const tenantAUsers = UserModel.bind({ tenantId: 'tenantA' });
const tenantBUsers = UserModel.bind({ tenantId: 'tenantB' });
```

## When to use binding

Use binding when the tenant is fixed for a service or module and you want to avoid repeating context. Avoid binding when context changes per request — prefer `AbimongoContext` in that case.

## Best practices

- Prefer runtime context for request-driven apps.
- Use binding for service-level scoping.
- Avoid deeply chaining bindings.
