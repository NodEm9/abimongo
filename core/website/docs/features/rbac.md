# Role-Based Access Control (RBAC) in Abimongo_Core

**Abimongo_Core** provides a comprehensive Role-Based Access Control (RBAC) system that enables fine-grained permission management for your MongoDB operations and GraphQL resolvers. The RBAC system is designed to work seamlessly with multi-tenancy and provides both declarative and programmatic access control.

---

## Key Features

- **Declarative Permission System**: Define permissions using simple string-based actions
- **Role-Based Authorization**: Assign roles with specific permissions to users
- **GraphQL Integration**: Automatic RBAC enforcement for GraphQL resolvers
- **Multi-Tenant Support**: Tenant-aware permission checking and cache management
- **Flexible Permission Model**: Support for resource-specific and ownership-based permissions
- **Cache Integration**: Performance-optimized with Redis-based permission caching
- **Middleware Integration**: Easy integration with Express.js and GraphQL middleware

---

## Core RBAC Functions

### 1. `enforceRBAC`

The primary middleware function that wraps resolvers or route handlers with RBAC enforcement.

#### Signature

```typescript
enforceRBAC<T>(
  handler: (parent: any, args: any, context: any, info?: any) => Promise<T>,
  requiredPermission: string
): (parent: any, args: any, context: any, info?: any) => Promise<T>
```

#### Parameters

- `handler`: The original resolver or handler function
- `requiredPermission`: The permission string required to execute the handler

#### Example

```typescript
import { enforceRBAC } from 'abimongo_core';

// Protect a GraphQL resolver
const resolvers = {
  Query: {
    users: enforceRBAC(async (_, args, context) => {
      const db = await getTenantDB(context.user.tenantId);
      return db.collection('users').find({}).toArray();
    }, 'read'),

    adminUsers: enforceRBAC(async (_, args, context) => {
      const db = await getTenantDB(context.user.tenantId);
      return db.collection('users').find({ role: 'admin' }).toArray();
    }, 'admin:read'),
  },

  Mutation: {
    createUser: enforceRBAC(async (_, { input }, context) => {
      const db = await getTenantDB(context.user.tenantId);
      const result = await db.collection('users').insertOne({
        ...input,
        tenantId: context.user.tenantId
      });
      return result;
    }, 'create'),

    deleteUser: enforceRBAC(async (_, { id }, context) => {
      const db = await getTenantDB(context.user.tenantId);
      await db.collection('users').deleteOne({ _id: new ObjectId(id) });
      return true;
    }, 'delete'),
  }
};
```

---

### 2. `checkPermission`

Direct permission checking function for programmatic access control.

#### Signature

```typescript
checkPermission(userRole: Role, requiredPermission: string): boolean
```

#### Parameters

- `userRole`: The user's role (Role enum or string)
- `requiredPermission`: The permission string to check

#### Example

```typescript
import { checkPermission, Role } from 'abimongo_core';

// Check permissions programmatically
const user = { role: Role.USER, tenantId: 'tenant-123' };

if (checkPermission(user.role, 'read')) {
  console.log('User can read data');
}

if (checkPermission(user.role, 'admin:manage')) {
  console.log('User has admin management permissions');
} else {
  console.log('Access denied: insufficient permissions');
}

// In a service function
async function getUserProfile(userId: string, requestingUser: any) {
  if (!checkPermission(requestingUser.role, 'read:own')) {
    throw new Error('Unauthorized: Cannot read user profiles');
  }
  
  // Proceed with operation
  const db = await getTenantDB(requestingUser.tenantId);
  return db.collection('users').findOne({ _id: new ObjectId(userId) });
}
```

---

### 3. `invalidateTenantCache`

Invalidates RBAC-related cache for a specific tenant and role combination.

#### Signature

```typescript
invalidateTenantCache(tenantId: string, role: Role): Promise<void>
```

#### Parameters

- `tenantId`: The tenant identifier
- `role`: The user role whose cache should be invalidated

#### Example

```typescript
import { invalidateTenantCache, Role } from 'abimongo_core';

// Invalidate cache after role changes
async function updateUserRole(userId: string, newRole: Role, tenantId: string) {
  const db = await getTenantDB(tenantId);
  
  // Update user role in database
  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: newRole } }
  );
  
  // Invalidate RBAC cache for this tenant and role
  await invalidateTenantCache(tenantId, newRole);
  
  console.log(`Cache invalidated for tenant ${tenantId}, role ${newRole}`);
}
```

---

## Role System

### Default Roles

```typescript
enum Role {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
  MODERATOR = 'moderator',
  EDITOR = 'editor'
}
```

### Role Hierarchy and Permissions

```typescript
// Default role permissions (implementation-dependent)
const rolePermissions = {
  admin: ['*'], // All permissions
  moderator: ['read', 'update', 'create', 'moderate'],
  editor: ['read', 'update', 'create:own'],
  user: ['read:own', 'update:own', 'create:own'],
  guest: ['read:public']
};
```

---

## Permission Patterns

### Basic Permissions

```typescript
// Basic CRUD permissions
'read'     // Read any data
'create'   // Create new data
'update'   // Update any data
'delete'   // Delete any data
```

### Scoped Permissions

```typescript
// Resource-specific permissions
'admin:read'      // Admin-level read access
'admin:manage'    // Admin management operations
'user:create'     // Create user accounts
'report:generate' // Generate reports
```

### Ownership-Based Permissions

```typescript
// Ownership-based permissions
'read:own'     // Read own data only
'update:own'   // Update own data only
'delete:own'   // Delete own data only
'create:own'   // Create data owned by user
```

### Public/Private Permissions

```typescript
// Visibility-based permissions
'read:public'   // Read public data
'read:private'  // Read private data
'create:public' // Create public content
```

---

## Express.js Integration

### Middleware Setup

```typescript
import express from 'express';
import { enforceRBAC, checkPermission } from 'abimongo_core';

const app = express();

// RBAC middleware for Express routes
const rbacMiddleware = (requiredPermission: string) => {
  return (req: any, res: any, next: any) => {
    const user = req.user; // Assuming user is attached to request
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!checkPermission(user.role, requiredPermission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Protected routes
app.get('/api/users', rbacMiddleware('read'), async (req, res) => {
  // Route handler for users with read permission
  const users = await getUsersFromDB(req.user.tenantId);
  res.json(users);
});

app.post('/api/users', rbacMiddleware('create'), async (req, res) => {
  // Route handler for users with create permission
  const newUser = await createUserInDB(req.body, req.user.tenantId);
  res.json(newUser);
});

app.delete('/api/users/:id', rbacMiddleware('delete'), async (req, res) => {
  // Route handler for users with delete permission
  await deleteUserFromDB(req.params.id, req.user.tenantId);
  res.json({ success: true });
});
```

---

## Multi-Tenant RBAC

### Tenant-Aware Permission Checking

```typescript
// Context structure for multi-tenant RBAC
interface UserContext {
  user: {
    id: string;
    role: Role;
    tenantId: string;
  };
  db?: Db;
  collection?: string;
}

// Tenant-isolated RBAC resolver
const tenantAwareResolver = enforceRBAC(async (_, args, context: UserContext) => {
  const { user } = context;
  const db = await getTenantDB(user.tenantId);
  
  // All operations are automatically scoped to the user's tenant
  return db.collection('documents')
    .find({ tenantId: user.tenantId })
    .toArray();
}, 'read');
```

### Tenant Cache Management

```typescript
// Invalidate cache when permissions change
async function updateTenantPermissions(tenantId: string, updates: any) {
  // Update tenant configuration
  await updateTenantConfig(tenantId, updates);
  
  // Invalidate cache for all roles in this tenant
  const roles = [Role.ADMIN, Role.USER, Role.MODERATOR];
  await Promise.all(
    roles.map(role => invalidateTenantCache(tenantId, role))
  );
  
  console.log(`Permissions updated and cache invalidated for tenant: ${tenantId}`);
}
```

---

## Advanced RBAC Patterns

### Conditional Permissions

```typescript
// Dynamic permission checking based on resource ownership
const conditionalResolver = enforceRBAC(async (_, { userId }, context: UserContext) => {
  const { user } = context;
  const db = await getTenantDB(user.tenantId);
  
  // Allow users to read their own profile, or admins to read any profile
  if (userId === user.id || checkPermission(user.role, 'admin:read')) {
    return db.collection('users').findOne({ 
      _id: new ObjectId(userId),
      tenantId: user.tenantId 
    });
  }
  
  throw new Error('Unauthorized: Can only access own profile');
}, 'read:own');
```

### Resource-Based Permissions

```typescript
// Check permissions based on resource type and action
function checkResourcePermission(
  userRole: Role, 
  resource: string, 
  action: string
): boolean {
  const permission = `${resource}:${action}`;
  return checkPermission(userRole, permission);
}

// Usage in resolvers
const resourceResolver = async (_, { resourceType, action }, context: UserContext) => {
  if (!checkResourcePermission(context.user.role, resourceType, action)) {
    throw new Error(`Unauthorized: Cannot ${action} ${resourceType}`);
  }
  
  // Proceed with operation
  return performResourceOperation(resourceType, action, context);
};
```

### Hierarchical Permissions

```typescript
// Check if user has permission or any higher-level permission
function hasPermissionOrHigher(userRole: Role, basePermission: string): boolean {
  // Check exact permission
  if (checkPermission(userRole, basePermission)) return true;
  
  // Check admin override
  if (checkPermission(userRole, 'admin:*')) return true;
  
  // Check wildcard permissions
  const parts = basePermission.split(':');
  if (parts.length > 1) {
    const wildcardPermission = `${parts[0]}:*`;
    return checkPermission(userRole, wildcardPermission);
  }
  
  return false;
}
```

---

## Error Handling

### Custom RBAC Errors

```typescript
class RBACError extends Error {
  constructor(
    message: string,
    public requiredPermission: string,
    public userRole: Role,
    public tenantId?: string
  ) {
    super(message);
    this.name = 'RBACError';
  }
}

// Enhanced enforceRBAC with detailed error reporting
const enhancedEnforceRBAC = <T>(
  handler: Function,
  requiredPermission: string
) => {
  return async (parent: any, args: any, context: UserContext): Promise<T> => {
    const { user } = context;
    
    if (!user) {
      throw new RBACError(
        'Authentication required',
        requiredPermission,
        Role.GUEST
      );
    }
    
    if (!checkPermission(user.role, requiredPermission)) {
      throw new RBACError(
        `Access denied: ${requiredPermission} permission required`,
        requiredPermission,
        user.role,
        user.tenantId
      );
    }
    
    return handler(parent, args, context);
  };
};
```

### Error Logging and Monitoring

```typescript
// RBAC middleware with comprehensive logging
const rbacWithLogging = (requiredPermission: string) => {
  return enforceRBAC(async (parent, args, context) => {
    const startTime = Date.now();
    
    try {
      // Log successful access
      console.log('RBAC Access Granted', {
        permission: requiredPermission,
        userRole: context.user.role,
        tenantId: context.user.tenantId,
        timestamp: new Date().toISOString()
      });
      
      const result = await originalHandler(parent, args, context);
      
      // Log performance metrics
      console.log('RBAC Operation Completed', {
        permission: requiredPermission,
        duration: Date.now() - startTime,
        success: true
      });
      
      return result;
    } catch (error) {
      // Log access failures
      console.error('RBAC Operation Failed', {
        permission: requiredPermission,
        userRole: context.user.role,
        error: error.message,
        duration: Date.now() - startTime
      });
      
      throw error;
    }
  }, requiredPermission);
};
```

---

## Performance Optimization

### Permission Caching

```typescript
// Cache permission results to reduce computation
const permissionCache = new Map<string, boolean>();

function checkPermissionCached(userRole: Role, permission: string): boolean {
  const cacheKey = `${userRole}:${permission}`;
  
  if (permissionCache.has(cacheKey)) {
    return permissionCache.get(cacheKey)!;
  }
  
  const hasPermission = checkPermission(userRole, permission);
  permissionCache.set(cacheKey, hasPermission);
  
  // Cache with TTL (clean up after 5 minutes)
  setTimeout(() => {
    permissionCache.delete(cacheKey);
  }, 300000);
  
  return hasPermission;
}
```

### Batch Permission Checks

```typescript
// Check multiple permissions at once
function checkMultiplePermissions(
  userRole: Role, 
  permissions: string[]
): Record<string, boolean> {
  return permissions.reduce((result, permission) => {
    result[permission] = checkPermission(userRole, permission);
    return result;
  }, {} as Record<string, boolean>);
}

// Usage in complex resolvers
const complexResolver = async (_, args, context: UserContext) => {
  const requiredPermissions = ['read', 'update', 'delete'];
  const userPermissions = checkMultiplePermissions(
    context.user.role, 
    requiredPermissions
  );
  
  return {
    data: userPermissions.read ? await fetchData() : null,
    canUpdate: userPermissions.update,
    canDelete: userPermissions.delete
  };
};
```

---

## Best Practices

### 1. Principle of Least Privilege

```typescript
// Grant minimum permissions required
const rolePermissions = {
  admin: ['admin:*'],
  editor: ['read', 'create', 'update:own'],
  viewer: ['read:public'],
  user: ['read:own', 'update:own']
};
```

### 2. Consistent Permission Naming

```typescript
// Use consistent naming patterns
const permissions = {
  // Resource:Action pattern
  'user:read',
  'user:create',
  'user:update',
  'user:delete',
  
  // Scoped permissions
  'admin:manage',
  'report:generate',
  
  // Ownership qualifiers
  'profile:read:own',
  'document:update:own'
};
```

### 3. Regular Permission Audits

```typescript
// Audit user permissions
async function auditUserPermissions(tenantId: string) {
  const db = await getTenantDB(tenantId);
  const users = await db.collection('users').find({}).toArray();
  
  const permissionReport = users.map(user => ({
    userId: user._id,
    role: user.role,
    permissions: getRolePermissions(user.role),
    lastActive: user.lastActiveAt
  }));
  
  return permissionReport;
}
```

### 4. Secure Default Configuration

```typescript
// Secure defaults
const defaultRBACConfig = {
  denyByDefault: true,
  requireAuthentication: true,
  logFailedAttempts: true,
  cacheTimeout: 300, // 5 minutes
  maxFailedAttempts: 5
};
```

---

## Integration Examples

### Complete GraphQL Setup

```typescript
import { AbimongoGraphQL, enforceRBAC } from 'abimongo_core';

const resolvers = {
  Query: {
    // Public data (no RBAC)
    publicInfo: async () => ({ message: 'This is public' }),
    
    // Protected data
    users: enforceRBAC(async (_, args, context) => {
      return getUsersForTenant(context.user.tenantId);
    }, 'read'),
    
    // Admin-only data
    systemStats: enforceRBAC(async () => {
      return getSystemStatistics();
    }, 'admin:read'),
  },
  
  Mutation: {
    // User can update own profile
    updateProfile: enforceRBAC(async (_, { input }, context) => {
      return updateUserProfile(context.user.id, input);
    }, 'update:own'),
    
    // Admin can manage users
    deleteUser: enforceRBAC(async (_, { userId }, context) => {
      return deleteUser(userId, context.user.tenantId);
    }, 'admin:delete'),
  }
};

const schema = await new AbimongoGraphQL()
  .customResolvers(resolvers)
  .generateSchema();
```

---

This RBAC system provides enterprise-grade access control for Abimongo_Core applications, ensuring secure and scalable permission management across multi-tenant environments.
