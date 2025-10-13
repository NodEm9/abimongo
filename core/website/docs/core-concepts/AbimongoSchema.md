# AbimongoSchema

The `AbimongoSchema` class is a core component of the **Abimongo_Core** library. It provides a powerful way to define and enforce schemas for MongoDB collections, enabling validation, relationships, middleware hooks, and virtual fields.

---

## Key Features

- **Schema Definition**: Define the structure and validation rules for MongoDB documents.
- **Custom Validators**: Add field-specific validation logic.
- **Indexes**: Define and apply indexes to optimize query performance.
- **Relationships**: Define relationships between collections.
- **Virtual Fields**: Add computed fields to documents.
- **Middleware Hooks**: Add pre/post hooks for CRUD operations.

---

## Constructor

### Signature

```typescript
constructor(schemaDefinition: Record<keyof T, any>)
```

### Parameters

- `schemaDefinition` (`Record<keyof T, any>`): The schema definition for the document.

---

## Methods

### 1. `getSchema`

Retrieves the schema definition.

#### Signature

```typescript
getSchema(): Record<keyof T, any>
```

#### Returns

- `Record<keyof T, any>`: The schema definition.

#### Example

```typescript
const schemaDefinition = userSchema.getSchema();
console.log('Schema Definition:', schemaDefinition);
```

---

### 2. `validator`

Adds a custom validator for a specific field.

#### Signature

```typescript
validator(field: string, fn: (value: any) => boolean): void
```

#### Parameters

- `field` (string): The field to validate.
- `fn` (function): The validation function.

#### Example

```typescript
userSchema.validator('email', (value) => value.includes('@'));
```

---

### 3. `validate`

Validates a document against the schema's custom validators.

#### Signature

```typescript
validate(doc: OptionalUnlessRequiredId<T>): void
```

#### Parameters

- `doc` (`OptionalUnlessRequiredId<T>`): The document to validate.

#### Throws

- `Error`: If validation fails for any field.

#### Example

```typescript
try {
  userSchema.validate({ name: 'John Doe', email: 'invalid-email' });
} catch (error) {
  console.error('Validation Error:', error.message);
}
```

---

### 4. `index`

Adds an index to the schema.

#### Signature

```typescript
index(fields: any, options?: any): void
```

#### Parameters

- `fields` (any): The fields to index.
- `options` (any, optional): Additional options for the index.

#### Example

```typescript
userSchema.index({ email: 1 }, { unique: true });
```

---

### 5. `applyIndexes`

Applies all defined indexes to a MongoDB collection.

#### Signature

```typescript
async applyIndexes(collection: Collection<any>): Promise<void>
```

#### Parameters

- `collection` (`Collection<any>`): The MongoDB collection to apply indexes to.

#### Returns

- `Promise<void>`: Resolves when all indexes are applied.

#### Example

```typescript
await userSchema.applyIndexes(usersCollection);
```

---

### 6. `addRelationship`

Defines a relationship between collections.

#### Signature

```typescript
addRelationship(ref: string, localField: keyof T): void
```

#### Parameters

- `ref` (string): The name of the referenced collection.
- `localField` (keyof T): The field in the current document that holds the reference.

#### Example

```typescript
userSchema.addRelationship('orders', 'userId');
```

---

### 7. `getRelationships`

Retrieves all relationships defined in the schema.

#### Signature

```typescript
getRelationships(): Relationship[]
```

#### Returns

- `Relationship[]`: An array of relationships.

#### Example

```typescript
const relationships = userSchema.getRelationships();
console.log('Relationships:', relationships);
```

---

### 8. `virtual`

Adds a virtual field to the schema.

#### Signature

```typescript
virtual(name: string, getter: (doc: any) => any): void
```

#### Parameters

- `name` (string): The name of the virtual field.
- `getter` (function): The function to compute the virtual field's value.

#### Example

```typescript
userSchema.virtual('fullName', (doc) => `${doc.firstName} ${doc.lastName}`);
```

---

### 9. `applyVirtuals`

Applies all virtual fields to a document.

#### Signature

```typescript
applyVirtuals(doc: any): void
```

#### Parameters

- `doc` (any): The document to apply virtual fields to.

#### Example

```typescript
userSchema.applyVirtuals(userDocument);
console.log('Full Name:', userDocument.fullName);
```

---

### 10. `addHook`

Adds a hook to be executed for a specific event.

#### Signature

```typescript
addHook(event: string, fn: HookFunction): void
```

#### Parameters

- `event` (string): The event name (e.g., "save", "delete").
- `fn` (HookFunction): The hook function to execute.

#### Example

```typescript
userSchema.addHook('save', async (doc) => {
  console.log('Before saving:', doc);
});
```

---

### 11. `executeHooks`

Executes all hooks for a specific event.

#### Signature

```typescript
async executeHooks(event: string, data: any): Promise<void>
```

#### Parameters

- `event` (string): The event name.
- `data` (any): The data to pass to the hook functions.

#### Returns

- `Promise<void>`: Resolves when all hooks are executed.

#### Example

```typescript
await userSchema.executeHooks('save', userDocument);
```

---

### 12. `pre`

Adds a pre-hook for a specific action.

#### Signature

```typescript
pre(action: string, fn: HookFunction): void
```

#### Parameters

- `action` (string): The action name (e.g., "save", "delete").
- `fn` (HookFunction): The hook function to execute before the action.

#### Example

```typescript
userSchema.pre('save', async (doc) => {
  doc.updatedAt = new Date();
  console.log('Pre-save hook executed');
});
```

---

### 13. `getHooks`

Retrieves all hooks for a specific action.

#### Signature

```typescript
getHooks(action: string): Array<HookFunction>
```

#### Parameters

- `action` (string): The action name.

#### Returns

- `Array<HookFunction>`: An array of hook functions.

#### Example

```typescript
const saveHooks = userSchema.getHooks('save');
console.log(`Number of save hooks: ${saveHooks.length}`);
```

---

### 14. `post`

Adds a post-hook for a specific action.

#### Signature

```typescript
post(action: string, fn: HookFunction): void
```

#### Parameters

- `action` (string): The action name (e.g., "save", "delete").
- `fn` (HookFunction): The hook function to execute after the action.

#### Example

```typescript
userSchema.post('save', async (doc) => {
  console.log('Document saved successfully:', doc._id);
  // Send notification, update cache, etc.
});
```

---

### 15. `triggerMiddleware`

Triggers middleware for a specific action.

#### Signature

```typescript
async triggerMiddleware(action: string, data: any): Promise<void>
```

#### Parameters

- `action` (string): The action name.
- `data` (any): The data to pass to the middleware functions.

#### Returns

- `Promise<void>`: Resolves when all middleware functions are executed.

#### Example

```typescript
await userSchema.triggerMiddleware('save', userDocument);
```

---

## Middleware Hooks

The `AbimongoSchema` class supports middleware hooks for CRUD operations. Hooks can be added using the `pre` and `post` methods.

### Example: Adding Hooks

```typescript
userSchema.pre('save', async (doc) => {
  console.log('Before saving:', doc);
});

userSchema.post('save', async (doc) => {
  console.log('After saving:', doc);
});
```

---

### Advanced Hook Examples

```typescript
// Pre-save validation and transformation
userSchema.pre('save', async (doc) => {
  // Auto-generate slug from name
  if (doc.name && !doc.slug) {
    doc.slug = doc.name.toLowerCase().replace(/\s+/g, '-');
  }
  
  // Hash password before saving
  if (doc.password && doc.isModified('password')) {
    doc.password = await bcrypt.hash(doc.password, 10);
  }
  
  // Set timestamps
  doc.updatedAt = new Date();
  if (!doc.createdAt) {
    doc.createdAt = new Date();
  }
});

// Post-save actions
userSchema.post('save', async (doc) => {
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
userSchema.pre('delete', async (doc) => {
  // Archive related data
  await ArchiveService.archiveUserData(doc._id);
  
  // Cancel subscriptions
  await SubscriptionService.cancelUserSubscriptions(doc._id);
});

// Post-delete cleanup
userSchema.post('delete', async (doc) => {
  // Remove from cache
  await Cache.delete(`user:${doc._id}`);
  
  // Log deletion
  console.log(`User ${doc._id} has been deleted`);
});
```

---

## Example: Full Workflow

Here’s a complete example demonstrating the usage of `AbimongoSchema`:

```typescript
import { AbimongoSchema } from 'abimongo_core';

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
userSchema.validator('email', (value) => value.includes('@'));
userSchema.validator('age', (value) => value >= 0 && value <= 150);

// Add indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ name: 1, age: 1 });

// Add virtual fields
userSchema.virtual('fullName', (doc) => `${doc.firstName} ${doc.lastName}`);
userSchema.virtual('isAdult', (doc) => doc.age >= 18);

// Add relationships
userSchema.addRelationship('orders', 'userId');
userSchema.addRelationship('posts', 'authorId');

// Add middleware hooks
userSchema.pre('save', async (doc) => {
  console.log('Before saving:', doc);
  doc.updatedAt = new Date();
});

userSchema.post('save', async (doc) => {
  console.log('After saving:', doc);
  // Trigger cache invalidation, notifications, etc.
});

userSchema.pre('delete', async (doc) => {
  console.log('Before deleting:', doc._id);
  // Cleanup related data
});

userSchema.post('delete', async (doc) => {
  console.log('After deleting:', doc._id);
  // Final cleanup
});

// Get all hooks for debugging
const saveHooks = userSchema.getHooks('save');
console.log(`Total save hooks: ${saveHooks.length}`);

// Manually trigger middleware (useful for testing)
await userSchema.triggerMiddleware('save', mockUserDocument);
```

---

## Best Practices

1. **Define Clear Schemas**:
   - Use schemas to enforce data integrity and validation rules.

2. **Use Middleware Hooks**:
   - Add hooks to handle pre/post-processing for CRUD operations.

3. **Leverage Virtual Fields**:
   - Use virtual fields to compute derived values dynamically.

4. **Define Indexes**:
   - Add indexes to optimize query performance.

---

## Next Steps

- Explore the [API Documentation](/api) for detailed information on all available methods and features.
- Check out the [Getting Started Guide](../getting-started/installation.md) for installation instructions.

---

## Support

For questions or support, please open an issue on the [GitHub repository](https://github.com/your-repo/abimongo_core_library).
