# Transactions

---

## Overview

Abimongo simplifies MongoDB transactions by managing sessions automatically through the context system.

You no longer need to manually pass sessions across functions or services.

---

## Basic Usage

```ts
import { AbimongoContext } from '@abimongo/core';

await AbimongoContext.withTransaction(async () => {
  await UserModel.create({ name: 'Alice' });
  await OrderModel.create({ item: 'Book' });
});

All operations inside the block share the same MongoDB session.

How It Works

When you call withTransaction:

A session is created
The session is stored in AbimongoContext
All model operations automatically use that session
The transaction is committed or aborted
Nested Transactions

Abimongo detects existing sessions and reuses them:

await AbimongoContext.withTransaction(async () => {
  await serviceA();

  await AbimongoContext.withTransaction(async () => {
    // uses the same session
    await serviceB();
  });
});
Manual Transaction Control

For advanced scenarios:

await AbimongoContext.run({}, async () => {
  const session = await provider.startSession();

  session.startTransaction();

  try {
    await UserModel.create(...);
    await session.commitTransaction();
  } catch (e) {
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
});
Context Integration

Transactions are automatically injected into context:

const ctx = AbimongoContext.get();
console.log(ctx?.session);
Best Practices
Prefer withTransaction over manual session handling
Avoid mixing manual and automatic transactions
Keep transaction blocks small and focused