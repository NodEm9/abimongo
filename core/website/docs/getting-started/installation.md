# Installation Guide

This guide will walk you through the installation process for the **Abimongo_Core** library, an enterprise-grade ORM/ODM for MongoDB.

---

## Prerequisites

Before installing `Abimongo_Core`, ensure you have the following:

1. **Node.js**: Version 14 or higher is required. You can download it from [Node.js Official Website](https://nodejs.org/).
2. **MongoDB**: MongoDB is installed on your project. A running MongoDB instance (local or cloud). You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud-based solution or Self-deployed.
3. **Redis** (Optional): For caching support. Install Redis locally or use a cloud-based service like [Redis Cloud](https://redis.com/redis-enterprise-cloud/). 
`Note: In most cases Redis should come pre-installed when you install Abimongo_core.`
4. **Package Manager**: npm or yarn.

---

## Installation

### Step 1: Install the Library

Use npm or yarn to install the `Abimongo_Core` library.

#### Using npm

```bash
npm install @abimongo/core
```

#### Using yarn

```bash
yarn add @abimongo/core
```

---

### Step 2: Install Peer Dependencies

`Abimongo_Core` relies on the following peer dependencies:

- **MongoDB Node.js Driver**: For interacting with MongoDB.
- **Redis**: For caching (optional but recommended). Abimongo_Core uses Redis under the hood. However, you should check to be sure it comes with redis pre-installed.
- **GraphQL** If your project uses GraphQL and you want to leaverage the libray's internal support for GraphQL.

Install these dependencies using npm or yarn:

#### Using npm

```bash
npm install mongodb redis
```

#### Using yarn

```bash
yarn add mongodb redis
```

---

### Step 3: Verify Installation

To verify that the library and its dependencies are installed correctly, run the following command:

```bash
npm list abimongo_core mongodb redis
```

You should see the installed versions of `abimongo_core`, `mongodb`, and `redis`.

---

## Configuration

### MongoDB Connection

Ensure you have a MongoDB instance running. Use the connection URI to connect to your database. For example:

```bash
mongodb://localhost:27017/my_database
or
// env:
process.env.MONGO_URI
```

<!-- ### Environment Variables

In Abimongo_Core some defaults environment variables exists for example, if you use enviroment variable for your connection string which most likely is what you are doing, make sure you set it as `MONGO_URI` likewise the database name as ` -->

### Redis Configuration (Optional)

If you plan to use caching, ensure Redis is running and accessible. Use the Redis connection URI in your configuration. For example:

```bash
redis://localhost:6379
or
// env:
process.env.REDIS_URL
```

<!-- ---

## Example: Basic Setup

Here’s a quick example to get started with `Abimongo_Core`:

### Step 1: Define a Schema

```typescript
import { AbimongoSchema } from '@abimongo/core';

const userSchema = new AbimongoSchema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
});
```

### Step 2: Create a Model

```typescript
import { AbimongoModel } from '@abimongo/core';

const UserModel = new AbimongoModel({
  collectionName: 'users',
  schema: userSchema,
});
```

### Step 3: Perform CRUD Operations

```typescript
(async () => {
  // Create a new user
  const user = await UserModel.create({ name: 'John Doe', email: 'john@example.com', age: 30 });

  // Find users
  const users = await UserModel.find({ age: { $gte: 18 } });

  console.log(users);
})();
``` -->

---

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running and accessible.
   - Verify the MongoDB URI.

2. **Redis Connection Error**:
   - Ensure Redis is running and accessible.
   - Verify the Redis URI.

3. **Node.js Version**:
   - Ensure you are using Node.js version 14 or higher.

---

## Next Steps

- Explore the [Getting Started Guide](./gettting-started.md) for a deeper dive into `Abimongo_Core`.
- Check out the [API Documentation](/api) for detailed information on available methods and features.

---

## Support

For questions or support, please open an issue on the [GitHub repository](https://github.com/your-repo/abimongo_core_library).
