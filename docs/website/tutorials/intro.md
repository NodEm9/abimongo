---
title: "Tutorials"
slug: /
---

Welcome! This tutorial series walks you from a minimal "getting started" example to advanced patterns used in production with Abimongo: schema design, models, queries, multi-tenancy strategies, GraphQL integration, Redis caching, and deployment patterns.

What you'll learn

- How to install and import Abimongo
- Define schemas and models with TypeScript-friendly APIs
- Perform CRUD and advanced queries safely and efficiently
- Design multi-tenant data isolation strategies
- Integrate Abimongo with GraphQL and caching layers
- Best practices for testing, migrations, and production deployment

Prerequisites

- Node.js (v20 or later recommended)
- A basic familiarity with JavaScript or TypeScript
- A running MongoDB instance (local or hosted)

Quick start

Install the core package (using pnpm):

```bash
pnpm add @abimongo/core
```

Then create a simple schema and model:

```ts
import { AbimongoSchema, model } from '@abimongo/core';

const userSchema = new AbimongoSchema({
  username: String,
  email: String,
  roles: [String],
}, { timestamps: true });

export const User = model('User', userSchema);
```

Start the tutorials

- Run the docs locally and follow the step-by-step guides:

```bash
pnpm run docs:dev
```

- Or open the Tutorials category in the site: [core tutorials](/tutorials/core_tutotrials/core-tutorials)

If you want a recommended path: start with the core "Getting started" tutorial, then move to multi-tenancy and GraphQL integration as needed.

Happy building!
