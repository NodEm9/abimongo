# Advanced Usage

This section covers advanced patterns and architectural strategies for building production-grade systems with Abimongo.

These topics are especially relevant for:

- multi-tenant SaaS platforms
- high-throughput APIs
- distributed systems
- background processing pipelines

---

## 1. Transaction Management (Deep Dive)

Abimongo automatically manages transactions per request when enabled, but advanced scenarios require deeper control.

---

### Nested Transactions

Abimongo ensures transaction reuse across nested operations.

```ts
await AbimongoContext.withTransaction(async () => {
  await UserModel.create({ name: 'Alice' });

  await OrderModel.create({ user: 'Alice' });
});
```

**Guarantee:**

- A single session is reused.
- No duplicate transaction creation

### Manual Transaction Control

**For finer control:**

```ts
await runManualTransaction(async (session) => {
  await UserModel.create({ name: 'Alice' }, { session });
});
```

**Use this when:**

- integrating with external systems.
- orchestrating complex workflows.

## 2. Multi-Tenancy Strategies

Abimongo supports multiple tenant isolation strategies.

### Tenant-per-Database

```ts
tenantA → dbA
tenantB → dbB
```

**Best for:**

- strong data isolation.
- enterprise SaaS.

**Pros:**

- security isolation.
- easier backups.

**Cons:**

- more connections to manage.

### Tenant-per-Collection

```ts
users_tenantA
users_tenantB
```

**Best for:**

- lightweight multi-tenancy
- smaller systems

### Hybrid Strategy

- Combine both approaches for flexibility.

### Recommendation

> Use tenant-per-database for production SaaS systems.

---

## 3. Context Management (Advanced)

Understanding how and when context is available is critical.

### Accessing Context Safely

```ts
const ctx = AbimongoContext.get();

if (!ctx) {
  throw new Error('Context not initialized');
}
```

### Creating Custom Context

```ts
await AbimongoContext.run(
  {
    tenantId: 'tenantA',
    requestId: 'manual-ctx'
  },
  async () => {
    await UserModel.find({});
  }
);
```

#### When to use this

- background jobs
- CLI scripts
- scheduled tasks

## 4. Background Jobs & Workers

Background execution does not automatically inherit context.

### Example (Queue Worker)

```ts
async function processJob(job) {
  await AbimongoContext.run(
    {
      tenantId: job.tenantId,
      requestId: `job-${job.id}`
    },
    async () => {
      await UserModel.updateMany({}, { $set: { processed: true } });
    }
  );
}
```

### Key considerations

- Always provide tenantId.
- Generate a meaningful requestId.
- Avoid implicit assumptions about context.

### Anti-pattern

```ts
// ❌ Context will be undefined
setTimeout(async () => {
  await UserModel.find({});
});
```
--- 

## 5. Performance & Scaling

### Connection Management

- Use shared MongoClient instances.
- Avoid creating new clients per request.
- Leverage Abimongo provider system.

### Query Optimization

```ts
await UserModel.find({}, { projection: { name: 1 } });
```

- reduce payload size
- use indexes effectively

## 6. Observability & Instrumentation

### Measuring Queries

```ts
await measureQuery('UserModel.find', async () => {
  return UserModel.find({});
});
```

### Context-Aware Logging

```ts
const ctx = AbimongoContext.get();

console.log({
  tenant: ctx?.tenantId,
  requestId: ctx?.requestId
});
```

### Best Practice

**Integrate with:**

- structured logging (pino, winston)
- APM tools (Datadog, New Relic)

---

## 7. Middleware as System-Level Controls

Middleware can enforce global rules.

### Example: Audit Logging

```ts
UserModel.afterCreate((ctx) => {
  console.log('Created:', ctx.result);
});
```

### Example: Enforcing Tenant Safety

```ts
UserModel.beforeFind((ctx) => {
  if (!ctx.tenantId) {
    throw new Error('Missing tenant context');
  }
});
```

---

## 8. Cross-Service Architecture

In distributed systems:

- pass tenantId across services.
- propagate requestId for tracing.

### Example

```ts
fetch('/api/users', {
  headers: {
    'x-tenant-id': tenantId,
    'x-request-id': requestId
  }
});
```

---

## 9. Production Checklist

**Before going live, ensure:**

 1. Adapter is properly initialized.
 2. Tenant resolution is validated.
 3. Transactions are enabled only where needed.
 4. Context is handled in background jobs.
 5. Logging includes tenant + request ID.
 6. Dependencies are deduplicated.

### Key Takeaways

- Context is the foundation of Abimongo.
- Transactions are powerful but should be used intentionally.
- Multi-tenancy strategy defines system architecture.
- Background jobs require explicit context handling
Observability is critical for production systems.
