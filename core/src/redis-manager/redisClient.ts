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
 */
export class RedisService {
  private static instance: RedisService;
  // private client = redis;

  private redis: RedisClientType;
  private connected = false;

  private constructor(options: RedisOptions) {
    this.redis = createClient(options);
  }

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

  //  public async connect() {
  //   if (!this.connected && !this.redis.isOpen) {
  //     await this.redis.connect();
  //     this.connected = true;
  //     logger.info('✅ Redis connected');
  //   }
  // }
  // async connect(redisUrl: string): Promise<void> {
  //   if (!redisUrl) {
  //     throw new Error('❌ Redis URL is not provided. Please set REDIS_URI in your environment variables.');
  //   }
  //   if (this.client) return; // Already connected
  //   else await this.client
  //   logger.info('✅ Redis connected');
  // }

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

