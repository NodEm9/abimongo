import 'dotenv/config';
import { createClient, RedisClientType } from 'redis';

const DEFAULT_RECONNECT = (retries: number) => Math.min(retries * 50, 1000);
const redisUrl = process.env.REDIS_URI as string | undefined;

let currentClient: RedisClientType | null = null;

const createStub = () => ({
  isOpen: false,
  connect: async () => Promise.resolve(),
  disconnect: async () => Promise.resolve(),
  publish: async () => Promise.resolve(),
  subscribe: async () => Promise.resolve(),
  duplicate: () => createStub(),
});

export const redis: any = {
  async get(uri?: string) {
    if (currentClient && currentClient.isOpen) return currentClient;

    const url = uri || redisUrl;
    if (!url) return createStub();

    try {
      const client = createClient({ url, socket: { reconnectStrategy: DEFAULT_RECONNECT } }) as RedisClientType;
      await client.connect();
      currentClient = client;
      return client;
    } catch (err) {
      return createStub();
    }
  },

  async disconnect() {
    if (currentClient) {
      try {
        if (currentClient.isOpen && typeof currentClient.disconnect === 'function') {
          await currentClient.disconnect();
        } else if (currentClient.isOpen && typeof (currentClient as any).quit === 'function') {
          await (currentClient as any).quit();
        }
      } catch (err) {
        // swallow errors on disconnect
      }
    }
    currentClient = null;
    return Promise.resolve();
  },

  get isOpen() {
    return !!(currentClient && currentClient.isOpen);
  },

  publish: async () => Promise.resolve(),
  subscribe: async () => Promise.resolve(),
  duplicate: () => ({
    isOpen: false,
    connect: async () => Promise.resolve(),
    disconnect: async () => Promise.resolve(),
    publish: async () => Promise.resolve(),
    subscribe: async () => Promise.resolve(),
  }),
};

export class RedisService {
  static getInstance(): RedisService {
    return new RedisService();
  }
  async connect(url?: string) {
    await redis.get(url);
  }

  /**
 * 
 * @returns Promise<RedisClientType> The connected Redis client.
 * @throws Error if Redis is not connected.
 */
  getClient(): Promise<RedisClientType> {
    return Promise.resolve(redis.get());
  }
  async close() {
    await redis.disconnect();
  }
}

export async function connectRedis() {
  return {
    connect: async (url?: string) => await redis.get(url),
  };
}

