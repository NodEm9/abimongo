# Production Deployment Guide

This guide covers best practices for deploying Abimongo in production environments.

It is intended for:

- SaaS platforms
- high-traffic APIs
- distributed systems
- serverless architectures

---

## 1. Environment Configuration

Use environment variables to manage configuration.

```env
MONGO_URI=mongodb://localhost:27017
NODE_ENV=production
```

## 2. MongoDB Connection Strategy

### Use a Shared Client (Recommended)

Avoid creating a new MongoClient per request.

```ts
const client = new AbimongoClient({ uri: process.env.MONGO_URI! });
await client.connect();
```

Use this client across your application.

### Multi-Tenant Setup

```ts
initMultiTenancy({
  tenantA: 'mongodb://dbA',
  tenantB: 'mongodb://dbB'
});
```

### Best Practices

- Enable connection pooling (default in MongoDB driver).
- Monitor connection limits.
- Avoid reconnecting per request.

## 3. Runtime Deployment Options

### Option A: Node.js Server (Express / Fastify)

**Best for:**

- long-running APIs
- high throughput systems
- node dist/server.js

### Option B: Serverless (AWS Lambda)

**Best for:**

- event-driven workloads
- cost optimization

```ts
export const handler = createLambdaAdapter(handlerFn);
```

### Option C: Containerized (Docker)

**Best for:**

- scalable infrastructure
- Kubernetes deployments

```dockerfile
FROM node:20

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

CMD ["node", "dist/index.js"]
```

## 4. Transaction Strategy

Transactions are powerful but should be used selectively.

### When to Use

- financial operations
- multi-document consistency
- critical workflows

### When to Avoid

- simple read operations
- high-frequency endpoints

## 5. Logging & Monitoring

### Structured Logging

```ts
const ctx = AbimongoContext.get();

logger.info({
  tenantId: ctx?.tenantId,
  requestId: ctx?.requestId
});
```

### Recommended Tools

- @abimongo/logger - (Configured with Abimongo Core if logger is enabled. You can always opt out and plugin in your prefered logger )
- pino
- winston
- Datadog
- New Relic

## 6. Error Handling

Always handle async errors properly.

```ts
try {
  await UserModel.create(data);
} catch (err) {
  logger.error(err);
}
```

### Transaction Safety

- uncaught errors → automatic rollback.
- ensure handlers return Promises.

## 7. Scaling Considerations

### Horizontal Scaling

- stateless architecture.
- context handled via AsyncLocalStorage.
- safe across multiple instances.

### Multi-Tenant Scaling

- tenant-per-db for large systems.
- shard databases if needed.

## 8. Security Best Practices

- validate tenant IDs
- avoid trusting raw headers blindly
- implement authentication before adapter layer

## 9. Dependency Management

Ensure a single runtime instance:

```bash
pnpm why @abimongo/adapter-runtime
```

## 10. Production Checklist

- MongoDB connection stable
- Adapter initialized correctly
- Tenant resolution tested
- Transactions used intentionally
- Logging enabled
- Dependencies deduplicated
- Error handling implemented

### Key Takeaways

- Use shared connections
- Keep services stateless
- Treat context as a core system layer
- Validate multi-tenant boundaries

> Abimongo is built for production—configure it correctly to unlock its full potential.
