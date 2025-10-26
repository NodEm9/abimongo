import type { LoggerConfig } from '@abimongo/logger';
import { InitMultiTenancyOptions } from '../tanancy/init/initMultiTenancy';
import { AbimongoModelOptions } from './abimongo.mode.type';
import { SchemaDefinition } from './schema.type';
import { Document } from './document';


export interface AbimongoLoggerSettings extends LoggerConfig {
  enabled?: boolean; // Used only in config.json
  logger?: LoggerConfig['logger']; // Used only in config.json
  logLevel?: LoggerConfig['level'];
  useColor?: boolean;
  colorize?: LoggerConfig['colorize'];
  transports?: LoggerConfig['transports'];
  json?: boolean;
  formatOptions?: LoggerConfig['formatOptions'];
  excludedSources?: LoggerConfig['excludedSources'];
  hooks?: LoggerConfig['hooks'];
  enrichMetadata?: LoggerConfig['enrichMetadata'];
  enableMetrics?: LoggerConfig['enableMetrics']
  shouldLog?: LoggerConfig['shouldLog'];
  circuitBreaker?: LoggerConfig['circuitBreaker'];
  compressLogFiles?: LoggerConfig['compressLogFiles'];
}


export interface AbimongoConfig {
  projectName?: string;
  mongoUri?: string;
  model?: AbimongoModelOptions;
  schema?: SchemaDefinition<Document>
  multiTenant?: {
    enabled?: true,
    headerKey?: "x-tenant-id",
    tenants?: {
      "tenant-a": "mongodb://localhost:27017/tenant-a",
      "tenant-b": "mongodb://localhost:27017/tenant-b"
    },
    initOptions?: InitMultiTenancyOptions
  };
  logger?: AbimongoLoggerSettings;
  graphql?: {
    enabled?: boolean;
    subscriptions?: true;
    playground?: false;
    schemaOutputPath?: string;
  };
  features?: {
    models?: string;
    schemas?: string;
    typeDefs?: string;
    resolvers?: string;
    useRedisCache?: boolean;
    redisUri?: string;
  };
  advanced?: {
    circuitBreaker?: {
      enabled?: boolean;
      retryAttempts?: number;
    };
    garbageCollector?: {
      enabled?: boolean;
      retentionPeriod?: number | string; // Retain data for a specified number of days
      logResults?: false; // Log results of garbage collection
    };
    gcCron?: string;
  };
}

export interface AbimongoConfigFile {
  projectName?: string;
  mongoUri: string;
  multiTenant?: AbimongoConfig['multiTenant'];
  // logger?: AbimongoLoggerSettings;
  graphql?: AbimongoConfig['graphql'];
  features?: AbimongoConfig['features'];
  advanced?: AbimongoConfig['advanced'];
}

export interface ProjectOptions {
  projectName?: string;
  mongoUri?: string;
  model?: AbimongoModelOptions;
  schema?: SchemaDefinition<Document>;
  multiTenant?: {
    enabled?: true,
    headerKey?: "x-tenant-id",
    tenants?: {
      "tenant-a": "mongodb://localhost:27017/tenant-a",
      "tenant-b": "mongodb://localhost:27017/tenant-b"
    },
    initOptions?: InitMultiTenancyOptions
  };
  // logger?: AbimongoLoggerSettings;
  graphql?: {
    enabled?: boolean;
    subscriptions?: true;
    playground?: false;
    schemaOutputPath?: string;
  };
  features?: {
    useRedisCache?: boolean;
    redisUri?: string;
    models?: string;
    typeDefs?: string;
    schemas?: string;
    resolvers?: string;
  };
  compressLogFiles?: {
    enabled?: boolean;
  },
  enableMetrics?: {
    enabled?: boolean;
    logInterval?: number; // in milliseconds
  },
  advanced?: {
    circuitBreaker?: {
      enabled?: boolean;
      retryAttempts?: number;
    };
    garbageCollector?: {
      enabled?: boolean;
      retentionPeriod?: number; // Retain data for a specified number of days
      logResults?: false; // Log results of garbage collection
    };
    gcCron?: string;
  };
}