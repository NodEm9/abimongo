# Adapters Overview

Abimongo is designed to be framework-agnostic. Rather than coupling core logic to a specific runtime (such as Express or NestJS), Abimongo utilizes a modular adapter system to provide seamless integration across diverse execution environments.

## Design Rationale

Modern Node.js runtimes implement request handling using different patterns:

- **Express**: Middleware-based execution  
- **Fastify**: Hook-based lifecycle  
- **NestJS**: Interceptor and Guard pipelines  
- **GraphQL**: Context factory resolution  
- **AWS Lambda**: Event handler wrappers  

The adapter layer unifies these disparate patterns into a standardized execution flow:

> **Inbound Request → Context Initialization → Standardized Execution**

---

## Core Capabilities

Adapters provide a consistent interface for managing the request lifecycle, including:

- **Tenant Resolution:** Automated extraction of tenant identity from the request  
- **Request ID Propagation:** Ensures traceability across distributed logs  
- **Context Management:** Initialization and scoping of `AbimongoContext`  
- **Transaction Orchestration:** Optional automated wrapping of operations in database transactions  
- **Request Normalization:** Converts runtime-specific objects (e.g., `IncomingMessage` vs. Lambda Event) into a predictable internal format  

---

## Architecture & Package Structure

The adapter system is decoupled into three distinct layers to ensure maintainability:

- **@abimongo/adapter-types**: Shared interfaces and contracts  
- **@abimongo/adapter-runtime**: Core execution logic and context utilities  
- **@abimongo/adapter-***: Runtime-specific implementations (e.g., `@abimongo/adapter-express`)  

---

### Execution Flow

1. **Inbound Request**: Triggered by the runtime  
2. **Adapter Layer**: Maps runtime-specific data to Abimongo requirements  
3. **runWithAdapterContext()**: Establishes the execution scope  
4. **AbimongoContext**: Powered by `AsyncLocalStorage` for type-safe global access  
5. **Application Logic**: Executes models, middleware, and transactions within a stable context  

---

> [!NOTE]
>
> ### Technical Implementation: Async Context Tracking
>
> Abimongo leverages Node.js `AsyncLocalStorage` to manage request-scoped execution. This enables `AbimongoContext` to be accessed anywhere within a request lifecycle—without manually passing context, sessions, or tenant data through your application layers.
>
> **Why this matters:**
>
> - Eliminates "prop drilling" of context and session objects  
> - Ensures consistent access to tenant, request ID, and transaction state  
> - Keeps business logic clean and framework-agnostic  
>
> **Performance impact:**
> The overhead of `AsyncLocalStorage` is minimal (typically sub-millisecond per request) and is suitable for production workloads, including high-throughput APIs.
>
> This design aligns with modern Node.js patterns for request isolation used in high-scale applications.

---

### Example (Conceptual)

```ts
await runWithAdapterContext(req, async () => {
  // Context is now globally available

  const ctx = AbimongoContext.get();

  console.log(ctx?.tenantId);   // auto-resolved
  console.log(ctx?.session);    // auto-propagated

  await UserModel.find({});
});
```

---

> [!IMPORTANT]
>
> ### Execution Scope
>
> `AbimongoContext` is bound to the current asynchronous execution chain. To ensure consistency, all application logic must execute within the adapter-managed request lifecycle.
>
> If you trigger work outside this scope (e.g., `setTimeout`, background jobs, event emitters, or detached promises), the context will not be preserved automatically.
>
> **When this becomes an issue:**
>
> - Background processing (`setTimeout`, queues, cron jobs)
> - Fire-and-forget async operations
> - Event-driven architectures
>
> **Recommended approach:**
> For out-of-band execution, explicitly re-establish context using:
>
> ```ts
> AbimongoContext.run({ tenantId, requestId }, async () => {
>   // safe execution with restored context
> });
> ```
>
> This ensures tenant isolation, logging, and transaction behavior remain consistent.
>
> This behavior follows standard Node.js `AsyncLocalStorage` semantics.

---

## Supported Integrations

| Integration    | Runtime Category              | Status     |
|----------------|-------------------------------|------------|
| Express        | Node.js Web Framework         | Production |
| Fastify        | High-performance Framework    | Production |
| NestJS         | Dependency Injection Framework| Production |
| GraphQL        | Apollo / Yoga / Envelop       | Production |
| Lambda         | Serverless / Event-driven     | Production |

---

## Unified Configuration

All adapters adhere to a standardized configuration schema, ensuring a consistent developer experience across different environments:

```ts
{
  tenancy: {
    header: 'x-tenant-id',
    fallback: 'default'
  },
  requestIdHeader: 'x-request-id',
  enableTransactions: true
}
```

## Lifecycle Execution Steps

On every request, the adapter performs the following sequence:

1. Ingestion: Capture headers, parameters, and cookies from the provider.
2. Resolution: Identify the active tenant and request ID.
3. Scope Initialization: Invoke AbimongoContext.run() to wrap execution
4. Transaction Handling: (Optional) Wrap execution in withTransaction() if enabled.
5. Invocation: Execute downstream handlers or resolvers with a fully populated context.

## Value Proposition

The adapter system removes the operational overhead of manual context management.

- Without Adapters: Developers must manually extract tenant metadata, pass session objects through every function call, and rewrite boilerplate logic for each runtime.
- With Adapters: Logic is centralized and portable. You achieve a "Write Once, Deploy Anywhere" architecture that remains decoupled from the underlying framework.

---

## Troubleshooting: Context Resolution

If you encounter issues where `AbimongoContext` is `undefined` or tenant/session data is missing, review the following common scenario

### 1. Context Loss in Asynchronous Operations

`AsyncLocalStorage` preserves context across most async boundaries, but context can be lost when execution is detached from the original request lifecycle.e.

**The issue:**

- Using `setTimeout`, background jobs, or event emitters
- Fire-and-forget async functions (not awaited)
- External libraries that do not preserve async context

**The fix:**

- Ensure all async operations are properly awaited within the request handler
- For out-of-band execution, explicitly re-bind context:

```ts
AbimongoContext.run({ tenantId, requestId }, async () => {
  // safe execution
});
```

### 2. Middleware / Hook Execution Order

In frameworks like Express and Fastify, execution order is critical.

**The issue:**

- Accessing AbimongoContext before the adapter initializes it

**The fix:**

- Register the adapter early in the pipeline

**Recommended order:**

```ts
app.use(bodyParser());
app.use(logger());
app.use(abimongoAdapter); // must come before routes
app.use(routes);
```

### 3. Multiple Runtime Instances (Dependency Mismatch)

Abimongo relies on a shared AsyncLocalStorage instance via @abimongo/adapter-runtime.

**The issue:**

- Multiple versions of @abimongo/adapter-runtime installed
- Monorepo or workspace misconfiguration

**This can result in:**

- Context being set in one instance
- But read from another → returns undefined

**The fix:**

- Ensure a single resolved version:

```bash
pnpm why @abimongo/adapter-runtime
```

- Deduplicate dependencies
- Treat runtime as a shared dependency across packages

### Quick Diagnostic Checklist

| Symptom | Probable Cause | Recommendation |
| :--- | :--- | :--- |
| `AbimongoContext is undefined` | Adapter not initialized | Ensure adapter is registered (app.use(...), hooks, or module import) |
| `Tenant ID missing` | Header/config mismatch | Verify `tenancy.header` and incoming request headers. |
| `Context lost in async task` | Detached execution | Wrap with `AbimongoContext.run(...)` |
| `Transaction Rollback Failure` | Uncaught Exception/Handler not awaited | Ensure your handler returns/awaits a `Promise` for the adapter to catch. |

### Debug Tip

You can log the active context during execution:

```ts
console.log(AbimongoContext.get());
```

If this returns undefined, the execution is happening outside the managed context.

> Most context-related issues stem from execution occurring outside the adapter-managed lifecycle. When in doubt, first verify the exact execution context of your code.

## Context Guarantees

Abimongo provides a set of guarantees about how `AbimongoContext` behaves during request execution. These guarantees are fundamental to building reliable, multi-tenant, and transaction-safe applications.

---

### 1. Request-Scoped Isolation

Each incoming request operates within its own isolated context.

**Guarantee:**

- Context data (`tenantId`, `requestId`, `session`, etc.) is never shared across requests
- No cross-request leakage occurs

---

### 2. Automatic Context Propagation

Once initialized, the context is automatically available throughout the execution chain.

**Guarantee:**
- Accessible via `AbimongoContext.get()` at any point in the request lifecycle
- No need to manually pass context between layers

```ts
const ctx = AbimongoContext.get();

console.log(ctx?.tenantId);   // always available within request scope
```

### 3. Transaction Consistency

When transactions are enabled, the session is consistently propagated.

**Guarantee:**

- All database operations within the same request share the same session.
- Nested operations reuse the existing transaction.
- Commit/rollback behavior remains consistent across the execution chain.

### 4. Tenant Resolution Integrity

Tenant resolution is performed once per request and remains stable.

**Guarantee:**

- The resolved tenantId does not change during execution.
- All models and queries operate against the same tenant context.

### 5. Middleware Context Awareness

Model middleware always receives the correct merged context.

**Guarantee:**

- Middleware has access to:

  - tenant information
  - request metadata
  - session (if present)

- Context remains consistent before and after operations

### 6. Framework-Agnostic Behavior

Context behavior is consistent across all supported adapters.

**Guarantee:**

- Express, Fastify, NestJS, GraphQL, and Lambda all follow the same execution model.
- No runtime-specific differences in context handling

### 7. Explicit Boundary Awareness

Context is only guaranteed within the managed execution scope.

**Guarantee:**

- Context is valid within adapter-managed execution.
- Outside that scope, context must be explicitly re-established.

## What this means for you

With these guarantees, you can confidently:

- Build multi-tenant systems without manual isolation logic.
- Write clean business logic without passing context objects.
- Rely on consistent transaction behavior.
- Implement middleware and instrumentation without edge-case handling.

> In short: Abimongo handles execution context so you can focus on application logic.
