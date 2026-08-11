# Events

## Overview

Abimongo provides an event system for reacting to database changes.

It enables:

- real-time updates
- integration with external systems
- reactive architectures

---

### Event Types

Common events:

- `create`
- `update`
- `delete`
- `aggregate`
- `bulkInsert`
- `bulkUpdate`

---

### Example Event Payload

```ts
{
  action: "create",
  doc: {
    _id: "64f...",
    name: "Alice"
  }
}
```

### Publishing Events

Events are automatically emitted:

```ts
await pubsub.publish(
  `${DB_CHANGE_EVENT}_users`,
  JSON.stringify({
    documentInserted: {
      action: 'create',
      doc
    }
  })
);
```

### Subscribing to Events

```ts
UserModel.on('create', (data) => {
  console.log('Created:', data);
});
```

### Using Change Streams

```ts
await UserModel.watchChanges((change) => {
  console.log(change);
});
```

### Integration Examples

Real-Time UI

- push updates via WebSockets

Audit Logs

- track changes to documents

External Services

- trigger workflows or notifications

### Best Practices

- keep event handlers lightweight
- avoid blocking operations
- use queues for heavy processing

### Event Naming

Use structured naming:

```ts
DB_CHANGE_EVENT_users
```

### When to Use Events

- real-time systems
- analytics pipelines
- monitoring and logging

### Summary

Events enable:

- reactive systems
- real-time updates
- decoupled architectures