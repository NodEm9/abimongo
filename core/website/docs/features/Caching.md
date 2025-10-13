# Caching in Abimongo_Core

**Abimongo_Core** provides built-in support for Redis-based caching to optimize query performance and reduce database load. This feature is particularly useful for frequently accessed data or computationally expensive queries.

---

## Key Features

- **Redis Integration**: Uses Redis as the caching layer with connection pooling.
- **TTL (Time-to-Live)**: Supports configurable expiration for cached data.
- **Automatic Serialization**: Automatically serializes and deserializes data for storage and retrieval.
- **Cache Invalidation**: Provides methods to clear cached data when necessary.
- **Multi-Tenant Caching**: Tenant-aware caching with isolated cache namespaces.
- **Cache Warming**: Pre-populate cache with frequently accessed data.
- **Cache Statistics**: Monitor cache hit/miss ratios and performance metrics.

---

## Caching Methods

The following caching methods are available in the `AbimongoModel` class:

### 1. `findCached`

Retrieves a cached result by its key. If the key does not exist in the cache, it returns `null`.

#### Signature

```typescript
async findCached(key: string): Promise<any>
```

#### Parameters

- `key` (string): The cache key to retrieve the data.

#### Returns

- `Promise<any>`: The cached result, or `null` if the key does not exist.

#### Example

```typescript
const cachedResult = await UserModel.findCached('user_list_cache_key');
if (cachedResult) {
  console.log('Cache hit:', cachedResult);
} else {
  console.log('Cache miss');
}
```

---

### 2. `cacheResult`

Stores a result in the cache with a specified key and optional TTL (time-to-live).

#### Signature

```typescript
static async cacheResult(key: string, data: any, ttl = 3600): Promise<void>
```

#### Parameters

- `key` (string): The cache key to store the data.
- `data` (any): The data to cache.
- `ttl` (number, optional): The time-to-live for the cache in seconds. Defaults to `3600` seconds (1 hour).

#### Returns

- `Promise<void>`: Resolves when the data is successfully cached.

#### Example

```typescript
await AbimongoModel.cacheResult('user_list_cache_key', users, 600); // Cache for 10 minutes
```

---

### 3. `clearCache`

Clears a cached result by its key.

#### Signature

```typescript
static async clearCache(key: string): Promise<void>
```

#### Parameters

- `key` (string): The cache key to clear.

#### Returns

- `Promise<void>`: Resolves when the cache is successfully cleared.

#### Example

```typescript
await AbimongoModel.clearCache('user_list_cache_key');
console.log('Cache cleared');
```

---

### 4. `aggregateWithCache`

Executes an aggregation pipeline and caches the result. If the result is already cached, it retrieves the cached result instead of querying the database.

#### Signature

```typescript
async aggregateWithCache(
  pipeline: object[],
  cacheKey: string,
  cacheDuration = 300
): Promise<T[]>
```

#### Parameters

- `pipeline` (object[]): The MongoDB aggregation pipeline.
- `cacheKey` (string): The cache key to store or retrieve the result.
- `cacheDuration` (number, optional): The time-to-live for the cache in seconds. Defaults to `300` seconds (5 minutes).

#### Returns

- `Promise<T[]>`: The aggregation result, either from the cache or the database.

#### Example

```typescript
const pipeline = [{ $match: { age: { $gte: 18 } } }];
const cachedUsers = await UserModel.aggregateWithCache(pipeline, 'user_aggregation_cache_key', 600);

console.log('Aggregated Users:', cachedUsers);
```

---

### 5. `findWithCache`

Finds documents with automatic caching based on query filters.

#### Signature

```typescript
async findWithCache(
  filter: Filter<T>,
  cacheKey?: string,
  cacheDuration = 300
): Promise<T[]>
```

#### Parameters

- `filter` (`Filter<T>`): The MongoDB query filter.
- `cacheKey` (string, optional): Custom cache key. Auto-generated if not provided.
- `cacheDuration` (number, optional): TTL in seconds. Defaults to 300 seconds.

#### Example

```typescript
// Auto-generated cache key based on filter
const users = await UserModel.findWithCache({ status: 'active' });

// Custom cache key
const premiumUsers = await UserModel.findWithCache(
  { plan: 'premium' },
  'premium_users_list',
  3600
);
```

---

### 6. `invalidatePattern`

Invalidates multiple cache entries matching a pattern.

#### Signature

```typescript
static async invalidatePattern(pattern: string): Promise<number>
```

#### Parameters

- `pattern` (string): Redis pattern to match keys (supports wildcards).

#### Returns

- `Promise<number>`: Number of keys invalidated.

#### Example

```typescript
// Clear all user-related cache
await AbimongoModel.invalidatePattern('user:*');

// Clear tenant-specific cache
await AbimongoModel.invalidatePattern('tenant:123:*');
```

---

### 7. `getCacheStats`

Retrieves cache statistics for monitoring and optimization.

#### Signature

```typescript
static async getCacheStats(): Promise<CacheStats>
```

#### Returns

- `Promise<CacheStats>`: Object containing cache statistics.

#### Example

```typescript
const stats = await AbimongoModel.getCacheStats();
console.log(`Hit Rate: ${stats.hitRate}%`);
console.log(`Total Keys: ${stats.totalKeys}`);
console.log(`Memory Usage: ${stats.memoryUsage} MB`);
```

---

### 8. `warmCache`

Pre-populates cache with frequently accessed data.

#### Signature

```typescript
async warmCache(queries?: { filter?: Partial<T>; cacheKey?: string; ttl?: number }[], defaultTtl = 3600): Promise<void>
```

#### Parameters

- `queries` (Array, optional): Array of queries to pre-cache. If not provided, caches all documents (with size limit check).
- `defaultTtl` (number, optional): Default TTL in seconds. Defaults to 3600 seconds.

#### Example

```typescript
// Warm specific queries
await UserModel.warmCache([
  { filter: { status: 'active' }, cacheKey: 'active_users', ttl: 3600 },
  { filter: { role: 'admin' }, cacheKey: 'admin_users', ttl: 1800 }
]);

// Warm all documents (for small collections)
await UserModel.warmCache();
```

---

### 9. `invalidateModelPattern`

Instance method to invalidate cache patterns for this model's tenant context.

#### Signature

```typescript
async invalidateModelPattern(pattern: string): Promise<number>
```

#### Parameters

- `pattern` (string): Redis pattern to match keys (automatically adds tenant prefix if applicable).

#### Returns

- `Promise<number>`: Number of keys invalidated.

#### Example

```typescript
// Clear model-specific cache with tenant awareness
await userModel.invalidateModelPattern('profile:*');
// Internally becomes: tenant:123:profile:* if in tenant context
```

---

### 10. `invalidateDocumentCache`

Invalidates the cache for a specific document.

#### Signature

```typescript
async invalidateDocumentCache(doc: T): Promise<void>
```

#### Parameters

- `doc` (T): The document for which to invalidate the cache.

#### Example

```typescript
const user = await UserModel.findOne({ _id: userId });
await UserModel.invalidateDocumentCache(user);
```

---

## Static Caching Methods

### Cache Tracking

The library automatically tracks cache hits and misses for performance monitoring:

```typescript
// Cache tracking is automatically enabled
// Hit/miss data is stored with daily rotation and 7-day expiration
```

### Enhanced getCacheStats

```typescript
static async getCacheStats(tenantId?: string): Promise<CacheStats>
```

Returns comprehensive cache statistics including:

- Total keys and memory usage
- Hit/miss rates with actual calculations
- Tenant-specific statistics (if tenantId provided)
- Performance metrics with timestamps

#### Example

```typescript
// Global cache stats
const globalStats = await AbimongoModel.getCacheStats();
console.log(`Hit Rate: ${globalStats.hitRate}%`);
console.log(`Total Requests: ${globalStats.totalRequests}`);
console.log(`Memory Usage: ${globalStats.memoryUsage} MB`);

// Tenant-specific stats
const tenantStats = await AbimongoModel.getCacheStats('tenant-123');
console.log(`Tenant Keys: ${tenantStats.tenantKeys}`);
```

---

## Multi-Tenant Caching

Abimongo_Core automatically handles tenant-aware caching when used in multi-tenant environments.

### Tenant Cache Isolation

```typescript
// Cache keys are automatically prefixed with tenant ID
TenantContext.run('tenant-a', async () => {
  // Cache key becomes: "tenant-a:user_list_cache_key"
  await UserModel.findWithCache({ status: 'active' }, 'user_list_cache_key');
});

TenantContext.run('tenant-b', async () => {
  // Cache key becomes: "tenant-b:user_list_cache_key"
  await UserModel.findWithCache({ status: 'active' }, 'user_list_cache_key');
});
```

### Tenant Cache Management

```typescript
// Clear all cache for a specific tenant
await AbimongoModel.invalidatePattern('tenant:123:*');

// Get cache stats for a specific tenant
const tenantStats = await AbimongoModel.getCacheStats('tenant:123');
```

---

## Cache Configuration

### Redis Connection Configuration

```typescript
import { getRedisClient } from 'abimongo_core';

// Configure Redis connection
const redisConfig = {
  host: 'localhost',
  port: 6379,
  password: 'your-password',
  db: 0,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
};

// Initialize Redis client with custom config
await getRedisClient(redisConfig);
```

### Cache Middleware Configuration

```typescript
// Enable automatic caching for model operations
const UserModel = new AbimongoModel({
  collectionName: 'users',
  schema: userSchema,
  cacheConfig: {
    enabled: true,
    defaultTTL: 3600,
    keyPrefix: 'users',
    autoInvalidate: true, // Auto-invalidate on updates
  }
});
```

---

## Advanced Caching Patterns

### Cache-Aside Pattern

```typescript
async getUserProfile(userId: string): Promise<UserProfile> {
  const cacheKey = `user:profile:${userId}`;
  
  // Try cache first
  let profile = await UserModel.findCached(cacheKey);
  
  if (!profile) {
    // Cache miss - fetch from database
    profile = await UserModel.findOne({ _id: userId });
    
    if (profile) {
      // Store in cache for future requests
      await AbimongoModel.cacheResult(cacheKey, profile, 3600);
    }
  }
  
  return profile;
}
```

### Write-Through Caching

```typescript
async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
  // Update database
  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: userId },
    { $set: updates },
    { returnDocument: 'after' }
  );
  
  // Update cache immediately
  const cacheKey = `user:profile:${userId}`;
  await AbimongoModel.cacheResult(cacheKey, updatedUser, 3600);
  
  return updatedUser;
}
```

### Cache Warming Strategy

```typescript
// Application startup - warm critical caches
async function warmCriticalCaches() {
  try {
    // Warm user-related caches
    await UserModel.warmCache([
      { filter: { status: 'active' }, cacheKey: 'active_users', ttl: 3600 },
      { filter: { role: 'admin' }, cacheKey: 'admin_users', ttl: 1800 }
    ]);
    
    // Warm content caches
    await ContentModel.warmCache([
      { filter: { featured: true }, cacheKey: 'featured_content', ttl: 7200 }
    ]);
    
    console.log('Cache warming completed successfully');
  } catch (error) {
    console.error('Cache warming failed:', error);
    // Application continues to work without warm cache
  }
}
```

---

## How Caching Works

1. **Redis Integration**: The library uses a Redis client to store and retrieve cached data.
2. **Serialization**: Data is automatically serialized into JSON format before being stored in Redis.
3. **Cache Lookup**: When a caching method is called, the library first checks Redis for the specified key.
4. **Fallback to Database**: If the key is not found in Redis, the library queries the database and stores the result in Redis for future use.
5. **Cache Invalidation**: Cached data can be invalidated using the `clearCache` method.
6. **Multi-Tenant Isolation**: Cache keys are automatically prefixed with tenant IDs to ensure data isolation.
7. **Connection Pooling**: Redis connections are pooled for optimal performance.
8. **Automatic Invalidation**: Cache entries can be automatically invalidated when related data changes.

---

## Cache Performance Monitoring

### Real-time Monitoring

```typescript
import { CacheMonitor } from 'abimongo_core';

// Start cache monitoring
const monitor = new CacheMonitor({
  interval: 60000, // Check every minute
  alertThreshold: {
    hitRate: 80, // Alert if hit rate drops below 80%
    memoryUsage: 90 // Alert if memory usage exceeds 90%
  }
});

monitor.on('lowHitRate', (stats) => {
  console.warn(`Low cache hit rate: ${stats.hitRate}%`);
});

monitor.on('highMemoryUsage', (stats) => {
  console.warn(`High memory usage: ${stats.memoryUsage}%`);
});
```

### Cache Analytics

```typescript
// Generate cache performance report
const report = await AbimongoModel.generateCacheReport({
  timeframe: '24h',
  includeTenants: true,
  includeKeyPatterns: true
});

console.log(`Average Hit Rate: ${report.averageHitRate}%`);
console.log(`Top Cache Keys: ${report.topKeys.join(', ')}`);
console.log(`Memory Trend: ${report.memoryTrend}`);
```

---

## Best Practices for Caching

1. **Use Meaningful Cache Keys**:
   - Use descriptive keys that reflect the data being cached (e.g., `user_list_cache_key`).

2. **Set Appropriate TTL**:
   - Choose a TTL that balances performance and data freshness. For example, frequently updated data may require a shorter TTL.

3. **Invalidate Cache When Necessary**:
   - Use the `clearCache` method to invalidate outdated or stale data.

4. **Monitor Redis Usage**:
   - Ensure Redis has sufficient memory to handle your caching needs. Use eviction policies to manage memory usage.

5. **Implement Cache Warming**:
   - Pre-populate cache with critical data during application startup.

6. **Monitor Cache Performance**:
   - Regularly monitor hit rates and memory usage.
   - Set up alerts for performance degradation.

7. **Use Tenant-Aware Caching**:
   - Leverage automatic tenant isolation in multi-tenant applications.

8. **Implement Graceful Degradation**:
   - Ensure your application continues to work even if cache is unavailable.

9. **Use Proper Cache Warming**:
   - Implement cache warming during application startup
   - Use specific queries rather than caching entire collections
   - Handle cache warming failures gracefully

10. **Monitor and Alert**:
    - Set up monitoring for cache hit rates and memory usage
    - Configure alerts for performance degradation
    - Use the enhanced `getCacheStats()` for detailed monitoring

11. **Handle Large Collections Safely**:
    - The `warmCache()` method includes safety checks for large collections
    - Consider using specific queries for collections with >1000 documents
    - Implement batch processing for cache operations

---

## Example: Production-Ready Caching Workflow

```typescript
import { AbimongoModel, AbimongoSchema, TenantContext } from 'abimongo_core';

const userSchema = new AbimongoSchema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const UserModel = new AbimongoModel({
  collectionName: 'users',
  schema: userSchema,
});

(async () => {
  // Production caching workflow with error handling
  await TenantContext.run('tenant-123', async () => {
    try {
      // 1. Cache warming with specific queries
      await UserModel.warmCache([
        { filter: { status: 'active' }, cacheKey: 'active_users', ttl: 3600 },
        { filter: { role: 'admin' }, cacheKey: 'admin_users', ttl: 1800 }
      ]);

      // 2. Performance monitoring
      const stats = await AbimongoModel.getCacheStats('tenant-123');
      console.log(`Tenant cache performance:`, {
        hitRate: `${stats.hitRate}%`,
        memoryUsage: `${stats.memoryUsage} MB`,
        totalKeys: stats.tenantKeys
      });

      // 3. Intelligent cache operations
      const cacheKey = 'user_list_cache_key';
      let users = await UserModel.findCached(cacheKey);
      
      if (!users) {
        console.log('Cache miss - fetching from database');
        users = await UserModel.find({ status: 'active' });
        await AbimongoModel.cacheResult(cacheKey, users, 600);
      }

      // 4. Pattern-based cleanup
      await UserModel.invalidateModelPattern('temp:*');
      
      console.log('Production caching workflow completed');
    } catch (error) {
      console.error('Caching operation failed:', error);
      // Application continues to work without cache
    }
  });
})();
```

---

## Troubleshooting

- **Redis Connection Issues**:
  - Ensure Redis is running and accessible from your application.
  - Verify the Redis connection URI in your configuration.

- **Cache Misses**:
  - Check if the cache key is consistent across your application.
  - Ensure the TTL is not too short, causing frequent expirations.

- **Memory Issues**:
  - Monitor Redis memory usage with `getCacheStats()`.
  - Implement appropriate eviction policies in Redis configuration.
  - Use shorter TTLs for less critical data.

- **Cache Inconsistency**:
  - Implement proper cache invalidation strategies.
  - Use write-through caching for critical data consistency.

- **Performance Degradation**:
  - Monitor cache hit rates and optimize cache keys.
  - Consider cache warming for frequently accessed data.

- **Cache Warming Issues**:
  - Check collection size before warming (>1000 documents trigger warnings)
  - Use specific queries instead of warming entire collections
  - Monitor memory usage during cache warming operations

- **Performance Monitoring**:
  - Use `getCacheStats()` regularly to monitor cache health
  - Set up automated alerts for low hit rates (less than 80%)
  - Monitor memory usage and implement appropriate cleanup strategies

---

## Conclusion

The caching functionality in `Abimongo_Core` provides a powerful way to optimize query performance and reduce database load. By leveraging Redis, you can ensure faster response times and a more scalable application.
