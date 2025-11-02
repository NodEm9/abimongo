import 'dotenv/config';
import { AbimongoConfig } from "../types";

export interface LoggerFormatOptions {
  timestamp?: boolean | (() => string); // true = ISO, function = custom
  colorize?: boolean;
  source?: string;
  json?: boolean;
  prefix?: string;
}

export function DEFAULT_CONFIG_CONTENT(options: AbimongoConfig): string {
  return JSON.stringify({
    projectName: options.projectName || 'Abimongo',
    mongoUri: "mongodb://127.0.0.1:27017/mydb",
    multiTenant: {
      enabled: options.multiTenant || false,
      tenants: {
        // Example tenant configurations
        // Replace these with actual tenant names and URIs
        "tenant-a": "mongodb://localhost:27017/tenant-a",
        "tenant-b": "mongodb://localhost:27017/tenant-b"
      },
      initOptions: {
        lazy: true,

        // Optional: This configuration is basically to log tenant initialization
        // and can be customized based on your needs. It's not mandatory because it's exactly
        // the same as logger config that's already enabled when you initialize the project.
        config: {
          enabled: true,
          // Other configuration options can be added here
        }
      }
    },
    logger: {
      enabled: options.logger || false,
      level: options.logger?.logLevel || "info",
      useColor: true,
      colorize: true,
      formatOptions: {
        timestamp: true,
        colorize: true,
        prefix: "[Abimongo]",
        source: "app",
        json: false
      },
      transports: [{
        console: true,
        file: {
          enabled: false,
          path: "./logs/app.log",
          rotate: false,
          maxSize: "10m",
          maxFiles: 5
        }
      }],
      compressLogFiles: {
        enabled: options.logger?.compressLogFiles?.enabled || false
      },
      enableMetrics: {
        enabled: options.logger?.enableMetrics?.enabled || false,
        logInterval: options.logger?.enableMetrics?.logInterval || 60000
      },
    },
    graphql: {
      enabled: options.graphql?.enabled || false,
      playground: true,
      subscriptions: false,
      schemaOutputPath: './src/graphql/schema.gql'
    },
    features: {
      models: "./src/models",
      schemas: "./src/schemas",
      resolvers: "./src/resolvers",
      useRedisCache: options.features?.useRedisCache || false,
      redisUri: process.env.REDIS_URI || ""
    },
    advanced: {
      circuitBreaker: {
        enabled: options.advanced?.circuitBreaker?.enabled || false,
        retryAttempts: options.advanced?.circuitBreaker?.retryAttempts || 3
      },
      garbageCollector: {
        enabled: options.advanced?.garbageCollector?.enabled || true,
        retentionDays: 30, // Retain data for 30 days
        logResults: true, // Log results of garbage collection
      },
      gcCron: "0 0 * * *" // Default to daily at midnight
    }
  }, null, 2);
}