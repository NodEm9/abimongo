# Redis Integration in Abimongo_Core

**Abimongo_Core** provides comprehensive Redis integration for caching, real-time subscriptions, and performance optimization. Redis serves as the backbone for high-performance data operations and real-time features.

---

## Key Features

- **Caching Layer**: High-performance Redis-based caching for database queries
- **Real-time Subscriptions**: Pub/Sub mechanism for GraphQL subscriptions
- **Multi-Tenant Support**: Tenant-aware Redis operations with namespace isolation
- **Connection Management**: Automatic connection handling with reconnection logic
- **Performance Monitoring**: Built-in cache statistics and performance tracking
- **Event Publishing**: Automatic event publishing for database changes

---

## Redis Client Configuration

### Basic Setup

```typescript
import { redis, RedisService } from 'abimongo_core';

// Redis client is automatically configured
// Default connection: redis://localhost:6379
```

### Custom Configuration

```typescript
// Configure Redis connection in your environment
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.REDIS_PASSWORD = 'your-password';
process.env.REDIS_DB = '0';
```

### Advanced Configuration

```typescript
import { createRedisClient } from 'abimongo_core';

const redisConfig = {
  host: 'localhost',
  port: 6379,
  password: 'your-password',
  db: 0,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  family: 4, // IPv4
  connectTimeout: 10000,
  commandTimeout: 5000
};

const customRedis = createRedisClient(redisConfig);
```

---

## Caching Operations

### Basic Cache Operations

```typescript
import { redis } from 'abimongo_core';

// Set cache with TTL
await redis.setEx('user:123', 3600, JSON.stringify(userData));

// Get cached data
const cachedUser = await redis.get('user:123');
const user = cachedUser ? JSON.parse(cachedUser) : null;

// Delete cache
await redis.del('user:123');

// Check if key exists
const exists = await redis.exists('user:123');
```

### Pattern-Based Operations

```typescript
// Scan and delete keys matching pattern
let cursor = 0;
do {
  const result = await redis.scan(cursor, { 
    MATCH: 'user:*', 
    COUNT: 100 
  });
  cursor = result[0];
  const keys = result[1];
  
  if (keys.length > 0) {
    await redis.del(...keys);
  }
} while (cursor !== 0);

// Get all keys matching pattern
const userKeys = [];
cursor = 0;
do {
  const result = await redis.scan(cursor, { MATCH: 'user:*' });
  cursor = result[0];
  userKeys.push(...result[1]);
} while (cursor !== 0);
```

---

## Real-time Subscriptions

### Publisher Setup

```typescript
import { redis } from 'abimongo_core';

class EventPublisher {
  private publisher = redis.duplicate();

  async connect() {
    if (!this.publisher.isOpen) {
      await this.publisher.connect();
    }
  }

  async publishDocumentChange(collection: string, event: any) {
    await this.connect();
    const channel = `DB_CHANGE_EVENT_${collection}`;
    await this.publisher.publish(channel, JSON.stringify(event));
  }
}
```

### Subscriber Setup

```typescript
class EventSubscriber {
  private subscriber = redis.duplicate();

  async connect() {
    if (!this.subscriber.isOpen) {
      await this.subscriber.connect();
    }
  }

  async subscribeToCollection(collection: string, callback: (data: any) => void) {
    await this.connect();
    const channel = `DB_CHANGE_EVENT_${collection}`;
    
    await this.subscriber.subscribe(channel, (err, message) => {
      if (err) {
        console.error('Subscription error:', err);
        return;
      }
      
      try {
        const data = JSON.parse(message);
        callback(data);
      } catch (parseErr) {
        console.error('Message parse error:', parseErr);
      }
    });
  }
}
```

---

## Multi-Tenant Redis Operations

### Tenant Namespace Isolation

```typescript
import { TenantContext } from 'abimongo_core';

// Automatic tenant prefixing
TenantContext.run('tenant-123', async () => {
  // Cache key becomes: "tenant:tenant-123:user:456"
  await redis.setEx('user:456', 3600, JSON.stringify(userData));
  
  // Retrieve with tenant context
  const cachedData = await redis.get('user:456');
});
```

### Tenant Cache Management

```typescript
class TenantCacheManager {
  // Clear all cache for a specific tenant
  async clearTenantCache(tenantId: string): Promise<number> {
    const pattern = `tenant:${tenantId}:*`;
    let deletedCount = 0;
    let cursor = 0;

    do {
      const result = await redis.scan(cursor, { 
        MATCH: pattern, 
        COUNT: 100 
      });
      cursor = result[0];
      const keys = result[1];

      if (keys.length > 0) {
        const deleted = await redis.del(...keys);
        deletedCount += deleted;
      }
    } while (cursor !== 0);

    return deletedCount;
  }

  // Get tenant cache statistics
  async getTenantCacheStats(tenantId: string) {
    const pattern = `tenant:${tenantId}:*`;
    let keyCount = 0;
    let cursor = 0;

    do {
      const result = await redis.scan(cursor, { MATCH: pattern });
      cursor = result[0];
      keyCount += result[1].length;
    } while (cursor !== 0);

    return { tenantId, keyCount };
  }
}
```

---

## Performance Monitoring

### Cache Statistics

```typescript
import { AbimongoModel } from 'abimongo_core';

// Get comprehensive cache statistics
const stats = await AbimongoModel.getCacheStats();
console.log('Cache Performance:', {
  hitRate: `${stats.hitRate}%`,
  totalKeys: stats.totalKeys,
  memoryUsage: `${stats.memoryUsage} MB`,
  totalRequests: stats.totalRequests
});

// Tenant-specific statistics
const tenantStats = await AbimongoModel.getCacheStats('tenant-123');
console.log('Tenant Cache:', {
  tenantKeys: tenantStats.tenantKeys,
  hitRate: `${tenantStats.hitRate}%`
});
```

### Real-time Monitoring

```typescript
class RedisMonitor {
  async getRedisInfo() {
    const info = await redis.info();
    return {
      version: this.extractValue(info, 'redis_version'),
      connectedClients: this.extractValue(info, 'connected_clients'),
      usedMemory: this.extractValue(info, 'used_memory_human'),
      uptime: this.extractValue(info, 'uptime_in_seconds')
    };
  }

  async getKeyspaceInfo() {
    const info = await redis.info('keyspace');
    const dbMatch = info.match(/db0:keys=(\d+),expires=(\d+)/);
    
    return {
      totalKeys: dbMatch ? parseInt(dbMatch[1]) : 0,
      expiringKeys: dbMatch ? parseInt(dbMatch[2]) : 0
    };
  }

  private extractValue(info: string, key: string): string {
    const match = info.match(new RegExp(`${key}:(.+)`));
    return match ? match[1].trim() : 'N/A';
  }
}
```

---

## Event Publishing for GraphQL

### Database Change Events

```typescript
import { DB_CHANGE_EVENT } from 'abimongo_core';

class DatabaseEventPublisher {
  private publisher = redis.duplicate();

  async publishInsert(collection: string, document: any) {
    const event = {
      type: 'INSERT',
      collection,
      document,
      timestamp: new Date().toISOString()
    };

    await this.publisher.publish(
      `${DB_CHANGE_EVENT}_${collection}`, 
      JSON.stringify({ documentInserted: event })
    );
  }

  async publishUpdate(collection: string, document: any) {
    const event = {
      type: 'UPDATE',
      collection,
      document,
      timestamp: new Date().toISOString()
    };

    await this.publisher.publish(
      `${DB_CHANGE_EVENT}_${collection}`, 
      JSON.stringify({ documentUpdated: event })
    );
  }

  async publishDelete(collection: string, documentId: string) {
    const event = {
      type: 'DELETE',
      collection,
      documentId,
      timestamp: new Date().toISOString()
    };

    await this.publisher.publish(
      `${DB_CHANGE_EVENT}_${collection}`, 
      JSON.stringify({ documentDeleted: event })
    );
  }
}
```

---

## Connection Management

### Automatic Reconnection

```typescript
class RedisConnectionManager {
  private client = redis;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async ensureConnection(): Promise<boolean> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
        this.reconnectAttempts = 0;
        console.log('✅ Redis connection established');
        return true;
      }
      return true;
    } catch (error) {
      this.reconnectAttempts++;
      console.error(`❌ Redis connection failed (attempt ${this.reconnectAttempts}):`, error);
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        await this.delay(1000 * this.reconnectAttempts);
        return this.ensureConnection();
      }
      
      return false;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Health Checks

```typescript
class RedisHealthCheck {
  async isHealthy(): Promise<boolean> {
    try {
      const response = await redis.ping();
      return response === 'PONG';
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }

  async getConnectionStatus() {
    return {
      isConnected: redis.isOpen,
      isReady: redis.isReady,
      status: redis.status
    };
  }
}
```

---

## Best Practices

### 1. Connection Management
```typescript
// Always check connection before operations
if (!redis.isOpen) {
  await redis.connect();
}

// Use connection pooling for high-traffic applications
const redisPool = new Redis.Cluster([
  { host: 'redis-node-1', port: 6379 },
  { host: 'redis-node-2', port: 6379 }
]);
```

### 2. Error Handling
```typescript
async function safeRedisOperation<T>(operation: () => Promise<T>): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error('Redis operation failed:', error);
    return null;
  }
}

// Usage
const cachedData = await safeRedisOperation(() => 
  redis.get('user:123')
);
```

### 3. Memory Management
```typescript
// Set appropriate TTLs to prevent memory bloat
await redis.setEx('temp:data', 300, data); // 5 minutes

// Use Redis eviction policies
// maxmemory-policy: allkeys-lru (recommended)
```

### 4. Monitoring and Alerting
```typescript
// Set up monitoring for key metrics
setInterval(async () => {
  const info = await redis.info('memory');
  const memoryUsage = parseInt(info.match(/used_memory:(\d+)/)?.[1] || '0');
  
  if (memoryUsage > 100 * 1024 * 1024) { // 100MB threshold
    console.warn('Redis memory usage high:', memoryUsage);
  }
}, 60000); // Check every minute
```

---

## Troubleshooting

### Common Issues

**Connection Failures**
```typescript
// Check Redis server status
await redis.ping(); // Should return 'PONG'

// Check connection configuration
console.log('Redis config:', {
  host: redis.options.host,
  port: redis.options.port,
  db: redis.options.db
});
```

**Memory Issues**
```typescript
// Monitor memory usage
const memoryInfo = await redis.info('memory');
console.log('Memory usage:', memoryInfo);

// Clear expired keys manually
await redis.eval('return redis.call("DEL", unpack(redis.call("KEYS", ARGV[1])))', 0, 'expired:*');
```

**Subscription Issues**
```typescript
// Ensure separate clients for pub/sub
const publisher = redis.duplicate();
const subscriber = redis.duplicate();

await publisher.connect();
await subscriber.connect();

// Check subscription status
console.log('Subscriber channels:', await subscriber.pubSubChannels());
```

---

## Integration Examples

### With AbimongoModel Caching

```typescript
import { AbimongoModel } from 'abimongo_core';

// Automatic Redis integration
const users = await UserModel.findWithCache({ status: 'active' }, 'active_users', 3600);

// Manual cache operations
await AbimongoModel.cacheResult('user:profile:123', userProfile, 1800);
const cachedProfile = await UserModel.findCached('user:profile:123');
```

### With GraphQL Subscriptions

```typescript
// In GraphQL resolvers
const resolvers = {
  Subscription: {
    userUpdated: {
      subscribe: () => pubSub.asyncIterator(['USER_UPDATED']),
    },
  },
  Mutation: {
    updateUser: async (_, { id, input }) => {
      const user = await UserModel.findOneAndUpdate({ _id: id }, input);
      
      // Publish to Redis for real-time updates
      await redis.publish('USER_UPDATED', JSON.stringify(user));
      
      return user;
    },
  },
};
```

---

## Configuration Reference

### Environment Variables

```bash
# Redis connection
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-password
REDIS_DB=0

# Connection settings
REDIS_CONNECT_TIMEOUT=10000
REDIS_COMMAND_TIMEOUT=5000
REDIS_RETRY_ATTEMPTS=3

# Memory settings
REDIS_MAX_MEMORY=256mb
REDIS_EVICTION_POLICY=allkeys-lru
```

### Redis Configuration File

```ini
# redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
timeout 300
tcp-keepalive 300
save 900 1
save 300 10
save 60 10000
```

---

## Performance Optimization

### Connection Pooling

```typescript
// Use Redis Cluster for high availability
const cluster = new Redis.Cluster([
  { host: '127.0.0.1', port: 7000 },
  { host: '127.0.0.1', port: 7001 },
  { host: '127.0.0.1', port: 7002 }
]);
```

### Pipeline Operations

```typescript
// Batch multiple operations
const pipeline = redis.pipeline();
pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.expire('key1', 3600);
const results = await pipeline.exec();
```

---

This Redis integration provides a solid foundation for high-performance caching, real-time features, and scalable multi-tenant applications in Abimongo_Core.
