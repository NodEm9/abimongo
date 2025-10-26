// import { logger } from '../config';
import { RedisClientType } from 'redis';
import { redis } from '../redis-manager';

/**
 * Options for caching behavior.
 */
interface CacheOptions {
  ttlSeconds?: number;              // Time to live in seconds (default: 60)
  prefix?: string;                  // Optional prefix for key names
  tenantId?: string;                // Optional tenant scoping
  namespace?: string;               // Optional namespace for grouping
}

/**
 * Caches a value in Redis with optional tenant and namespace scoping.
 * If the value is not found in cache, it runs the provided fetcher function
 * to get the value, caches it, and then returns it.
 *
 * @param {string} key - The cache key to use.
 * @param {() => Promise<T>} fetcher - A function that fetches the value if not cached.
 * @param {CacheOptions} options - Options for caching behavior.
 * @returns {Promise<T>} - The cached or fetched value.
 * @example
 * const value = await cacheWithRedis(redisClient, 'myKey', async () => {
 *   // Fetch from database or external API
 *  return await fetchDataFromSource();
 */
export async function cacheWithRedis<T>(
  client: typeof redis,
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const {
    ttlSeconds = 60,
    prefix = '',
    tenantId,
    namespace,
  } = options;

  // Construct a namespaced Redis key
  const namespacedKey = [
    prefix,
    tenantId,
    namespace,
    key
  ].filter(Boolean).join(':');

  // Attempt to fetch from cache
  const cached = await client.get(namespacedKey);
  if (cached) {
    try {
      return JSON.parse(cached) as T;
    } catch (err) {
      console.warn(`⚠️ Failed to parse cached value for key "${namespacedKey}":`, err);
      await client.del(namespacedKey); // Clear corrupted cache
    }
  }

  // Fallback: run fetcher, then cache the result
  const result = await fetcher();
  await client.set(namespacedKey, JSON.stringify(result), { EX: ttlSeconds });
  return result;
}
