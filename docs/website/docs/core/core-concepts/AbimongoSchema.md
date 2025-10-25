# AbimongoSchema

`AbimongoSchema` is the schema abstraction used by @abimongo/core to describe document shapes, validations, indexes, relationships, virtual fields, and middleware hooks.

This page documents common usage patterns and the public API surface. For the authoritative implementation see `packages/core/src/lib-core/schema/AbimongoSchema.ts`.

---

## At a glance

- Define fields and validators for documents
- Register indexes and apply them to collections
- Declare relationships (refs) to other collections
- Add virtual/computed fields
- Register middleware hooks (pre/post) for lifecycle events

All method signatures are presented as TypeScript snippets to preserve generics and avoid markdown-lint issues.

---

## Constructor

Create a schema by passing a plain object describing fields and options:

```ts
constructor(definition: Record<string, any>, options?: SchemaOptions)
```

Notes

- `definition` follows a lightweight schema DSL used across the codebase (type, required, ref, default, validate, index, etc.).
- `options` can include collection-level settings such as timestamps, soft-delete behavior, and GC (garbage collection) hints.

---

## API: core methods

### getSchema

Return the raw schema definition object.

```ts
getSchema(): Record<string, any>
```

### validator

Register a field-level validator. The validator may be synchronous or return a Promise.

```ts
validator(field: string, fn: (value: any) => boolean | Promise<boolean>): void
```

### validate

Validate a document against the registered validators. Throws on first failure.

```ts
validate(doc: OptionalUnlessRequiredId<T>): void
```

### index

Declare an index to be applied later to a collection.

```ts
index(fields: Partial<Record<string, 1 | -1 | 'text'>>, options?: IndexOptions): void
```

### applyIndexes

Apply previously-declared indexes to a MongoDB collection.

```ts
async applyIndexes(collection: Collection<any>): Promise<void>
```

### addRelationship

Define a relationship (reference) to another collection. Useful for model-level population helpers.

```ts
addRelationship(name: string, localField: string, options?: { foreignCollection?: string; many?: boolean }): void
```

### getRelationships

Return relationships declared on the schema.

```ts
getRelationships(): Array<{ name: string; localField: string; options?: any }>
```

### virtual

Declare a virtual (computed) field.

```ts
virtual(name: string, getter: (doc: any) => any): void
```

### applyVirtuals

Apply virtuals to a document instance (mutates the document).

```ts
applyVirtuals(doc: any): void
```

---

## Middleware & hooks

AbimongoSchema supports registering hooks for lifecycle events (e.g., `save`, `update`, `delete`, `aggregate`). Hooks are composable and run in registration order.

### addHook

Register a generic hook for an event.

```ts
addHook(event: string, fn: HookFunction): void
```

### pre / post / getHooks

Convenience helpers for registering and inspecting hooks.

```ts
pre(action: string, fn: HookFunction): void
post(action: string, fn: HookFunction): void
getHooks(action: string): HookFunction[]
```

### executeHooks

Execute registered hooks programmatically (used internally by models).

```ts
async executeHooks(event: string, payload: any): Promise<void>
```

### triggerMiddleware

Alias used by model lifecycles to trigger middleware.

```ts
async triggerMiddleware(action: string, data: any): Promise<void>
```

Notes

- Pre-hooks may mutate the payload and can be async.
- Post-hooks receive the result and are intended for side-effects (publish events, invalidate caches, etc.).

---

## Advanced features

- Index declarations support compound, text, and unique indexes and will be applied with `applyIndexes`.
- Relationships can be used by `AbimongoModel` helpers such as `populateOne` and `populateMany` to resolve related documents.
- Virtuals are applied at read-time and do not persist to the DB unless explicitly mapped by your model logic.
- Schema options can include GC hints: `expiresIn`, `archiveBeforeDelete`, and `softDelete` which `AbimongoModel` honours during `runGC()` operations.

---

## Examples

### Define a simple user schema

```ts
const userSchema = new AbimongoSchema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, default: 18 },
    profileId: { type: "ObjectId", ref: "profiles" },
    createdAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

userSchema.validator(
  "email",
  (value) => typeof value === "string" && value.includes("@")
);
userSchema.virtual("isAdult", (doc) => (doc.age ?? 0) >= 18);
userSchema.index({ email: 1 }, { unique: true });
```

### Apply indexes to a collection

```ts
await userSchema.applyIndexes(db.collection("users"));
```

### Use hooks to add side-effects

```ts
userSchema.pre("save", async (doc) => {
  doc.updatedAt = new Date();
});

userSchema.post("save", async (doc) => {
  // notify or invalidate caches
  await Cache.invalidate(`users:${doc._id}`);
});
```

---

## Advanced Hook Examples

```ts
// Pre-save validation and transformation
userSchema.pre("save", async (doc) => {
  // Auto-generate slug from name
  if (doc.name && !doc.slug) {
    doc.slug = doc.name.toLowerCase().replace(/\s+/g, "-");
  }

  // Hash password before saving
  if (doc.password && doc.isModified && doc.isModified("password")) {
    doc.password = await bcrypt.hash(doc.password, 10);
  }

  // Set timestamps
  doc.updatedAt = new Date();
  if (!doc.createdAt) {
    doc.createdAt = new Date();
  }
});

// Post-save actions
userSchema.post("save", async (doc) => {
  // Clear related cache
  await Cache.clear(`user:${doc._id}`);

  // Send welcome email for new users
  if (doc.isNew) {
    await EmailService.sendWelcomeEmail(doc.email);
  }

  // Update search index
  await SearchIndex.updateUser(doc);
});

// Pre-delete cleanup
userSchema.pre("delete", async (doc) => {
  // Archive related data
  await ArchiveService.archiveUserData(doc._id);

  // Cancel subscriptions
  await SubscriptionService.cancelUserSubscriptions(doc._id);
});

// Post-delete cleanup
userSchema.post("delete", async (doc) => {
  // Remove from cache
  await Cache.delete(`user:${doc._id}`);

  // Log deletion
  console.log(`User ${doc._id} has been deleted`);
});
```

---

## Example: Full Workflow

```ts
import { AbimongoSchema } from "abimongo_core";

const userSchema = new AbimongoSchema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

// Add custom validators
userSchema.validator("email", (value) => value.includes("@"));
userSchema.validator("age", (value) => value >= 0 && value <= 150);

// Add indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ name: 1, age: 1 });

// Add virtual fields
userSchema.virtual("fullName", (doc) => `${doc.firstName} ${doc.lastName}`);
userSchema.virtual("isAdult", (doc) => doc.age >= 18);

// Add relationships
userSchema.addRelationship("orders", "userId");
userSchema.addRelationship("posts", "authorId");

// Add middleware hooks
userSchema.pre("save", async (doc) => {
  console.log("Before saving:", doc);
  doc.updatedAt = new Date();
});

userSchema.post("save", async (doc) => {
  console.log("After saving:", doc);
  // Trigger cache invalidation, notifications, etc.
});

userSchema.pre("delete", async (doc) => {
  console.log("Before deleting:", doc._id);
  // Cleanup related data
});

userSchema.post("delete", async (doc) => {
  console.log("After deleting:", doc._id);
  // Final cleanup
});

// Get all hooks for debugging
const saveHooks = userSchema.getHooks("save");
console.log(`Total save hooks: ${saveHooks.length}`);

// Manually trigger middleware (useful for testing)
await userSchema.triggerMiddleware("save", mockUserDocument);
```

---

## Best practices

- Keep schemas focused and explicit: prefer small, well-typed fields over large free-form blobs.
- Use validators for field-level guarantees and keep cross-field validation in hooks if it depends on multiple fields.
- Declare indexes as part of the schema and apply them during application startup.
- Use virtuals for read-only computed fields only.
- Keep expensive hooks asynchronous and non-blocking where possible (perform heavy work in background jobs).

---

## Where to go next

- See [AbimongoModel docs](./AbimongoModel.md) for how schemas integrate into models and lifecycle events.
- Check the Multi-Tenancy docs if you need tenant-scoped schema behaviour.

---

## Support

For questions or support, please open an issue on the project repository.
