# Adapter Usage Patterns

This section demonstrates real-world usage patterns for Abimongo adapters across different runtimes.

The goal is to show how Abimongo integrates seamlessly into your application while keeping your business logic clean and consistent.

---

## 1. Multi-Tenant REST API (Express)

A typical REST API where tenant isolation is handled automatically via headers.

### Setup

```ts
import express from 'express';
import { createExpressAdapter } from '@abimongo/core/adapters';

const app = express();

const adapter = createExpressAdapter();

adapter.install(app, {
  tenancy: {
    header: 'x-tenant-id',
    fallback: 'default'
  },
  enableTransactions: true
});
```

#### Route Example

```ts
app.get('/users', async (req, res) => {
  const users = await UserModel.find({});
  res.json(users);
});
```

#### Request

```http
GET /users
x-tenant-id: tenantA
```

**What happens:**

- Tenant is resolved from header.
- Context is initialized.
- Query runs against tenant-specific database.
- Transaction is automatically managed (if enabled).

## 2. Transactional Request (Fastify)

Ensuring all operations within a request are executed atomically.

### Example

```ts
app.post('/transfer', async (req, reply) => {
  await AccountModel.updateOne({ _id: 'A' }, { $inc: { balance: -100 } });
  await AccountModel.updateOne({ _id: 'B' }, { $inc: { balance: 100 } });

  return { success: true };
});
```

### Behavior

- Both operations share the same session.
- If one fails → entire transaction rolls back.
- No manual session handling required.

## 3. GraphQL Resolver (Apollo / Yoga)

Using Abimongo inside GraphQL resolvers.

### Resolver

```ts
const resolvers = {
  Query: {
    users: async () => {
      return UserModel.find({});
    }
  },
  Mutation: {
    createUser: async (_, args) => {
      return UserModel.create(args.input);
    }
  }
};
```

### Context Setup

```ts
createApolloContextFactory({
  tenancy: {
    header: 'x-tenant-id',
    fallback: 'default'
  }
});
```

**What happens:**

- Context is initialized per request.
- Resolvers automatically access tenant/session.
- Middleware and instrumentation remain active.

## 4. NestJS Service Layer

Using Abimongo in a structured, DI-driven application.

### Service

```ts
@Injectable()
export class UserService {
  async getUsers() {
    return UserModel.find({});
  }

  async createUser(data: any) {
    return UserModel.create(data);
  }
}
```

### Controller

```ts
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  getUsers() {
    return this.service.getUsers();
  }
}
```

### What happens

- Interceptor initializes context.
- Service layer remains clean.
- No context/session injection needed.

## 5. Serverless Function (Lambda)

Wrapping a Lambda handler with Abimongo.

### Example

```ts
import { createLambdaAdapter } from '@abimongo/adapter-lambda';

export const handler = createLambdaAdapter(async (event) => {
  const users = await UserModel.find({});

  return {
    statusCode: 200,
    body: JSON.stringify(users)
  };
});
```

### What happens

- Event is normalized into request-like structure.
- Context is initialized per invocation.
- Tenant/session handled automatically.

## 6. Background Job with Explicit Context

Handling jobs outside the request lifecycle (Advanced).

### Example

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

### Why this matters

- Background jobs do not inherit request context.
- Context must be explicitly initialized.
- Ensures tenant isolation and consistency.

## 7. Middleware-Driven Soft Delete

Applying global behavior via middleware.

### Example

```ts
UserModel.beforeFind((ctx) => {
  ctx.filter = {
    ...ctx.filter,
    isDeleted: { $ne: true }
  };
});
```

### Result

- All queries automatically exclude soft-deleted records.
- No need to repeat filters across codebase.

## 8. Observability / Instrumentation

Using built-in instrumentation for debugging and monitoring.

### Example

```ts
await measureQuery('UserModel.find', async () => {
  return UserModel.find({});
});
```

### Result

- Query timing is tracked.
- Logs include tenantId and requestId.
- Helps with performance monitoring.

## 9. Cross-Runtime Consistency

The same model logic works across all environments:

```ts
await UserModel.find({});
await UserModel.create({ name: 'Alice' });
```

**Whether running in:**

- Express
- Fastify
- NestJS
- GraphQL
- Lambda

Behavior remains identical.

### Key Takeaways

- Adapters eliminate boilerplate across runtimes.
- Context is automatically managed.
- Transactions are consistent and safe.
- Multi-tenancy is enforced without extra logic.
- Code remains clean and portable.

> Write your logic once. Run it anywhere.
