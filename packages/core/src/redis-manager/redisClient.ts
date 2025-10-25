import 'dotenv/config';
import { createClient, RedisClientType } from 'redis';


interface RedisOptions {
  url: string;
  socket?: {
    reconnectStrategy?: (retries: number) => number;
  };
}
const redisUrl = process.env.REDIS_URI as string

export const redis = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: retries => {
      try {
        console.log(`🔄 Redis reconnect attempt #${retries}`);
        return Math.min(retries * 50, 1000); // backoff strategy
      } catch (error) {
        console.error('❌ Error in Redis reconnect strategy:', error);
        return new Error('❌ Error in Redis reconnect strategy');
      }
    }
  }
});


/**
 * Singleton RedisService to manage Redis connections.
 * Ensures a single instance is used throughout the application.
 * Handles connection, disconnection, and client retrieval.
 * Automatically connects to Redis on instantiation.
 * * @example
 * const redisService = RedisService.getInstance();
 * await redisService.connect('redis://localhost:6379');
 * const client = redisService.getClient();
 * // Use the client for Redis operations
 * await redisService.disconnect();
 * @params options RedisOptions - Configuration options for Redis connection.
 */
export class RedisService {
  private static instance: RedisService;
  // private client = redis;

  private redis: RedisClientType;
  private connected = false;

  private constructor(options: RedisOptions) {
    this.redis = createClient(options);
  }

  /**
   * Get the singleton instance of RedisService.
   * @returns RedisService The singleton RedisService instance.
   */
  static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries: number) => {
            console.log(`🔄 Redis reconnect attempt #${retries}`);
            return Math.min(retries * 50, 1000); // backoff
          }
        }
      });
    }
    return RedisService.instance;
  }

  /**
   * Connect to the Redis server.
   * @returns Promise<void>
   */
   public async connect() {
    if (!this.connected && !this.redis.isOpen) {
      await this.redis.connect();
      this.connected = true;
      console.log('✅ Redis connected');
    }
  }

  /**
   * 
   * @returns Promise<RedisClientType> The connected Redis client.
   * @throws Error if Redis is not connected.
   */
  getClient(): Promise<RedisClientType> {
    if (!this.connected) {
      throw new Error('❌ Redis is not connected. Please call connect() first.');
    }
    return Promise.resolve(this.redis);
  }

  public async close() {
    if (this.redis.isOpen) await this.redis.quit();
  }
}




export async function connectRedis() {
  const connect = () => {
    return redis 
  }

  return {
    connect
  }
}

