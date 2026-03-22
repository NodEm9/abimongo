# Installation

## Requirements

Before installing Abimongo, ensure your environment meets the following requirements:

- Node.js (v16 or higher recommended)
- MongoDB (local or hosted, e.g., MongoDB Atlas)

---

## Install Abimongo

Install from npm:

```bash
npm install @abimongo/core
```

Or with pnpm:

```bash
pnpm add @abimongo/core
```

## Optional dependencies

Depending on your use case, you may also install the following packages:

- Redis (for caching)

```bash
npm install redis
```

- GraphQL / Apollo (if using GraphQL integration)

```bash
npm install graphql @apollo/server
```

## TypeScript support

Abimongo is written in TypeScript and provides full type support out of the box. No additional setup is required to consume the types when using TypeScript.

## Verify installation

Create a simple file, e.g. `index.ts`:

```ts
import { AbimongoModel } from '@abimongo/core';

console.log('Abimongo installed successfully');
```

Run it (depending on your setup, `node` or `ts-node`):

```bash
node index.ts
```

If no errors occur, you're ready to continue.

Next step: 👉 Quick Start
