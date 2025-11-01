import 'dotenv/config';
import { createClient, RedisClientType } from 'redis';


import 'dotenv/config';

interface RedisOptions {
  url?: string;
  socket?: {
    reconnectStrategy?: (retries: number) => number;
  };
}

const defaultRedisUrl = process.env.REDIS_URI as string | undefined;

// Internal client holder
let _client: RedisClientType | null = null;

// A small resilient wrapper exported as `redis` to preserve legacy callers
// that expect a `get(uri)` helper and simple `isOpen` / `disconnect` surface.
export const redis: any = {
  async get(uri?: string) {
    const url = uri || defaultRedisUrl;
    if (_client && _client.isOpen) return _client;
    if (!url) {
      // No URL available — return a lightweight stub that won't crash callers
      return {
        isOpen: false,
        connect: async () => undefined,
        disconnect: async () => undefined,
        publish: async () => undefined,
      } as Partial<RedisClientType>;
    }

    try {
      _client = createClient({ url } as any);
      // attach a best-effort reconnect strategy if supported
      // (some redis clients accept socket.reconnectStrategy)
      try {
        // attempt to connect, but don't throw if it fails — callers should be resilient
        await _client.connect();
      } catch (err) {
        // Log and return the client (it may be disconnected but present)
        // Avoid throwing to allow bootstrap to continue during CI/tests
        // eslint-disable-next-line no-console
        console.warn('[abimongo] Redis connection failed (continuing):', err?.message || err);
      }
      return _client;
    } catch (err) {
      // If creation fails, return a stub to keep other modules working
      // eslint-disable-next-line no-console
      console.warn('[abimongo] Failed to create Redis client:', err?.message || err);
      return {
        isOpen: false,
        connect: async () => undefined,
        disconnect: async () => undefined,
        publish: async () => undefined,
      } as Partial<RedisClientType>;
    }
  },
  // helper accessors used by other modules
  get isOpen() {
    return !!(_client && _client.isOpen);
  },
  async disconnect() {
    if (_client && _client.isOpen) {
      try {
        await _client.disconnect();
      } catch (err) {
        // ignore
      }
    }
  }
};

/**
 * Lightweight RedisService singleton (kept for compatibility with some callers).
 */
export class RedisService {
  private static instance: RedisService | null = null;
  private client: RedisClientType | null = null;

  private constructor() { }

  static getInstance(): RedisService {
    if (!RedisService.instance) RedisService.instance = new RedisService();
    return RedisService.instance;
  }

  async connect(url?: string) {
    this.client = (await redis.get(url)) as RedisClientType;
    return this.client;
  }

  getClient() {
    if (!this.client) throw new Error('RedisService: client not connected');
    return this.client;
  }

  async close() {
    await redis.disconnect();
    this.client = null;
  }
}

export async function connectRedis() {
  return {
    getClient: async () => (await redis.get()) as RedisClientType,
    connect: async () => (await redis.get()) as RedisClientType,
    disconnect: async () => await redis.disconnect(),
  };
}

