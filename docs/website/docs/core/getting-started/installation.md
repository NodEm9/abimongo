# Installation

A short, practical installation guide for @abimongo/core. This page shows how to install the package, satisfy the runtime dependencies, and run a minimal local development setup.

---

## Prerequisites

- Node.js 14+ (LTS recommended)
- A MongoDB server (local or hosted)
- Redis (optional — required for caching and GraphQL subscriptions)
- npm or yarn

Note: Redis is not pre-installed by the package. If you want caching or pub/sub features, run a Redis server locally or use a cloud provider.

---

## Install the package

Install from npm in your project:

```bash
npm install @abimongo/core
# or
yarn add @abimongo/core
```

### Peer / runtime dependencies

Install the MongoDB and Redis clients (and GraphQL libs if you plan to use GraphQL features):

```bash
npm install mongodb redis
# GraphQL (optional)
npm install graphql @apollo/server
```

You can pin versions to your project's policy, but the library is designed to work with recent stable releases of these clients.

---

## Configuration (environment variables)

The core package reads connection URIs from environment variables. The recommended variables are:

- `MONGO_URI` — MongoDB connection string; e.g. `mongodb://localhost:27017/mydb`
- `REDIS_URI` — Redis connection string; e.g. `redis://localhost:6379`

Example (.env):

```ini
MONGO_URI=mongodb://localhost:27017/abimongo_dev
DB_NAME=your-db-name
REDIS_URI=redis://localhost:6379
```

Load these into your app using your preferred method (dotenv, environment configuration in your process manager, or container environment).

---

## Quick start (programmatic)

A minimal example that connects, defines a schema and model, performs one write and then exits.

```ts
import { AbimongoClient, AbimongoSchema, AbimongoModel } from '@abimongo/core';

async function main() {
  const client = new AbimongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017/abimongo_dev');

  await client.connect();

  const userSchema = new AbimongoSchema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }
  });

  const UserModel = new AbimongoModel({ collectionName: 'users', schema: userSchema });

  await UserModel.create({ name: 'Alice', email: 'alice@example.com' });

  await AbimongoClient.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
```

---

## Local development with Docker (optional)

Use Docker Compose to spin up MongoDB and Redis locally for development. Create a `docker-compose.yml` with the following services:

```yaml
version: '3.8'
services:
  mongo:
    image: mongo:6.0
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:7
    ports:
      - '6379:6379'

volumes:
  mongo-data:
```

Start the stack and point your app to `MONGO_URI=mongodb://localhost:27017/abimongo_dev` and `REDIS_URI=redis://localhost:6379`.

---

## Verify installation

A quick way to verify the package and its dependencies are present in your project:

```bash
npm ls @abimongo/core mongodb redis || true
```

You can also run a small script (like the Quick start above) to exercise connection, simple CRUD, and a graceful shutdown.

---

## Common issues & troubleshooting

- MongoDB connection failures:
  - Confirm the `MONGO_URI` is correct and the server is reachable.
  - If using authentication, ensure the URI contains credentials or the environment is configured.

- Redis not connecting:
  - Confirm `REDIS_URI` points to a running Redis instance. Redis is optional unless you use caching or subscriptions.

- Node version errors:
  - Ensure Node.js 14+ is installed and used by your process manager or runtime.

---

## Next steps

- Read the [Getting Started guide](./gettting-started.md) for a minimal application example.
- Read [Multi-Tenancy](../core-concepts/MultiTenancy.md) if you plan to run per-tenant databases.
- See [Redis integration](../features/redis.md) and [Caching](../features/Caching.md) for caching and pub/sub guidance.

---

If you'd like, I can run a markdown-lint pass across the docs and fix any MDxxx issues or update the package README next.
