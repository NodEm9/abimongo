# Role-Based Access Control (RBAC) in Abimongo Core

Abimongo Core includes a flexible, tenant-aware Role-Based Access Control (RBAC) system built to protect database operations and GraphQL resolvers. It supports declarative permissions, programmatic checks, caching for performance, and integrates with middleware (Express / GraphQL) and multi-tenant flows.

---

## Key features

- Declarative string-based permissions (e.g. `read`, `update:own`, `admin:*`)
- Role-based authorization (assign permissions to roles)
- GraphQL resolver middleware (`enforceRBAC`) for automatic enforcement
- Tenant-aware checks and cache invalidation
- Redis-backed permission cache for performance (optional)
- Middleware-friendly for Express and GraphQL servers

---

## Overview — primary APIs

- `enforceRBAC(handler, requiredPermission)` — Wrap resolver/handler and enforce a permission.
- `checkPermission(userRole, requiredPermission)` — Programmatic permission check (boolean).
- `invalidateTenantCache(tenantId, role)` — Invalidate RBAC cache for a tenant and role.

Each function is designed to work with the project's tenant context helpers (for example, `getTenantDB` and `TenantContext`).

---

## enforceRBAC

Wrap resolvers or route handlers with RBAC enforcement. `enforceRBAC` checks the caller's permissions (including ownership/scoped rules) and throws a clear error if unauthorized.

Signature:

```ts
enforceRBAC<T>(
  handler: (parent: any, args: any, context: any, info?: any) => Promise<T>,
  requiredPermission: string
): (parent: any, args: any, context: any, info?: any) => Promise<T>
```

Example (GraphQL resolvers):

```ts
import { enforceRBAC } from 'abimongo_core';

const resolvers = {
  Query: {
    users: enforceRBAC(async (_, args, context) => {
      const db = await getTenantDB(context.user.tenantId);
      return db.collection('users').find({ tenantId: context.user.tenantId }).toArray();
    }, 'read'),

    adminUsers: enforceRBAC(async (_, args, context) => {
      const db = await getTenantDB(context.user.tenantId);
      return db.collection('users').find({ role: 'admin' }).toArray();
    }, 'admin:read')
  },

  Mutation: {
    createUser: enforceRBAC(async (_, { input }, context) => {
      const db = await getTenantDB(context.user.tenantId);
      const result = await db.collection('users').insertOne({ ...input, tenantId: context.user.tenantId });
      return result;
    }, 'create'),

    deleteUser: enforceRBAC(async (_, { id }, context) => {
      const db = await getTenantDB(context.user.tenantId);
      await db.collection('users').deleteOne({ _id: new ObjectId(id), tenantId: context.user.tenantId });
      return true;
    }, 'delete')
  }
};
```

Notes:

- `enforceRBAC` should receive a context that includes the authenticated `user` (with `role` and `tenantId`).
- The middleware supports ownership-based semantics (e.g., `read:own`) by passing resource identifiers and relying on `checkPermission` or the internal ownership checks.

---

## checkPermission

Programmatic permission check useful in services or custom middleware.

Signature:

```ts
checkPermission(userRole: Role | string, requiredPermission: string): boolean
```

Example:

```ts
import { checkPermission, Role } from 'abimongo_core';

const user = { role: Role.USER, tenantId: 'tenant-123' };

if (checkPermission(user.role, 'read')) {
  // allowed
}

if (!checkPermission(user.role, 'admin:manage')) {
  // denied
}
```

Implementation notes:

- The default role-to-permissions map is configurable; it commonly includes admin overrides (e.g. `admin: ['*']`).
- `checkPermission` may support wildcards and hierarchical checks (e.g., permission `report:*` or `admin:*`).

---

## invalidateTenantCache

Invalidate RBAC caches for a given tenant and role. Useful after permission changes (for a user or tenant configuration).

Signature:

```ts
invalidateTenantCache(tenantId: string, role: Role | string): Promise<void>
```

Example:

```ts
import { invalidateTenantCache, Role } from 'abimongo_core';

async function updateUserRole(userId: string, newRole: Role, tenantId: string) {
  const db = await getTenantDB(tenantId);
  await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: { role: newRole } });

  // Invalidate permission cache so changes take effect immediately
  await invalidateTenantCache(tenantId, newRole);
}
```

---

## Roles & default permissions

A typical set of roles (customizable) might be:

```ts
enum Role {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  EDITOR = 'editor',
  USER = 'user',
  GUEST = 'guest'
}
```

Default permissions (example mapping):

```ts
const rolePermissions = {
  admin: ['*'],
  moderator: ['read', 'update', 'create', 'moderate'],
  editor: ['read', 'update', 'create:own'],
  user: ['read:own', 'update:own', 'create:own'],
  guest: ['read:public']
};
```

Design notes:

- `admin: ['*']` is a convenient default for full access but can be restricted.
- Permission mappings are often loaded from configuration or a tenant-scoped store for multi-tenant setups.

---

## Permission patterns

Use these common patterns to express authorization needs:

1. Basic CRUD permissions (global): `read`, `create`, `update`, `delete`.
1. Scoped/resource permissions: `admin:read`, `report:generate`, `user:create`.
1. Ownership-based permissions: `read:own`, `update:own`, `delete:own`.
1. Visibility-based permissions: `read:public`, `read:private`.

---

## Express integration

Add small middleware helpers that leverage `checkPermission` to protect routes.

```ts
import express from 'express';
import { checkPermission } from 'abimongo_core';

const app = express();

const rbacMiddleware = (requiredPermission: string) => (req: any, res: any, next: any) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Authentication required' });
  if (!checkPermission(user.role, requiredPermission)) return res.status(403).json({ error: 'Insufficient permissions' });
  next();
};

app.get('/api/users', rbacMiddleware('read'), async (req, res) => {
  const users = await getUsersFromDB(req.user.tenantId);
  res.json(users);
});
```

Notes:

- Middleware should assume `req.user` contains the authenticated user (role + tenantId).
- For GraphQL, prefer `enforceRBAC` on resolvers to maintain consistent behavior.

---

## Multi-tenant RBAC

RBAC integrates with tenant-aware helpers so permission checks are scoped to tenant context by default.

Example tenant-aware resolver:

```ts
interface UserContext { user: { id: string; role: Role; tenantId: string }; db?: Db; collection?: string }

const tenantAwareResolver = enforceRBAC(async (_, args, context: UserContext) => {
  const { user } = context;
  const db = await getTenantDB(user.tenantId);
  return db.collection('documents').find({ tenantId: user.tenantId }).toArray();
}, 'read');
```

Cache invalidation example (tenant-level permission update):

```ts
async function updateTenantPermissions(tenantId: string, updates: any) {
  await updateTenantConfig(tenantId, updates);
  const roles = [Role.ADMIN, Role.USER, Role.MODERATOR];
  await Promise.all(roles.map(role => invalidateTenantCache(tenantId, role)));
}
```

---

## Advanced patterns

### Conditional/ownership checks

Sometimes you need to allow users to operate on their own resources but deny access otherwise.

```ts
const conditionalResolver = enforceRBAC(async (_, { userId }, context: UserContext) => {
  const { user } = context;
  const db = await getTenantDB(user.tenantId);
  if (userId === user.id || checkPermission(user.role, 'admin:read')) {
    return db.collection('users').findOne({ _id: new ObjectId(userId), tenantId: user.tenantId });
  }
  throw new Error('Unauthorized: Can only access own profile');
}, 'read:own');
```

### Resource-based permissions

Use resource/action pairs to form permissions dynamically.

```ts
function checkResourcePermission(userRole: Role, resource: string, action: string): boolean {
  const permission = `${resource}:${action}`;
  return checkPermission(userRole, permission);
}
```

### Hierarchical/wildcard permissions

Support wildcards and hierarchical checks for compact permission sets.

```ts
function hasPermissionOrHigher(userRole: Role, basePermission: string): boolean {
  if (checkPermission(userRole, basePermission)) return true;
  if (checkPermission(userRole, 'admin:*')) return true;
  const parts = basePermission.split(':');
  if (parts.length > 1) {
    const wildcardPermission = `${parts[0]}:*`;
    return checkPermission(userRole, wildcardPermission);
  }
  return false;
}
```

---

## Operational guidance & best practices

- Keep permission definitions small and descriptive (e.g., `read:own`, `report:generate`).
- Favor scope-specific permissions over broad `*` when possible.
- In multi-tenant deployments, keep permission mappings tenant-scoped when different tenants require different rules.
- After changing role or tenant permissions, call `invalidateTenantCache` to avoid stale checks.
- Log RBAC denials with context (user id, tenant id, attempted permission) for auditing.

---

## Troubleshooting

- If legitimate users are denied, check the effective permission list for their role and tenant.
- Verify the GraphQL/HTTP context includes `user.role` and `user.tenantId`.
- Ensure cache invalidation runs after permission or role updates.

---

## Where to go next

- See [GraphQL integration](./AbimongoGraphQL.md) for resolver usage examples.
- Read [Multi-Tenancy](../core-concepts/MultiTenancy.md) for tenant management patterns.
- Review [Redis integration](./redis.md) if using the permission cache.

---

## Reference

For implementation details see `packages/core/src/lib-core/` (search for `rbac`, `enforceRBAC`, and `invalidateTenantCache`).
