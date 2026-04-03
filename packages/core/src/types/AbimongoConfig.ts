import { LoggerConfig } from '@abimongo/logger';
import { InitMultiTenancyOptions } from '../tanancy';
import { AbimongoModelOptions } from './abimongo.mode.type';
import { SchemaDefinition } from './schema.type';
import { Document } from './document';
import { BootstrapClient } from './bootstrapClient.type';


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
  enableMetrics?: LoggerConfig['enableMetrics'];
  shouldLog?: LoggerConfig['shouldLog'];
  circuitBreaker?: LoggerConfig['circuitBreaker'];
  compressLogFiles?: LoggerConfig['compressLogFiles'];
}

export interface AbimongoConfig {
  projectName?: string;
  provider?: BootstrapClient;
  mongoClient?: BootstrapClient;
  connection?: {
    uri: string;
    options?: any;
  };
  model?: AbimongoModelOptions;
  schema?: SchemaDefinition<Document>;
  multiTenant?: {
    enabled?: boolean;
    headerKey?: string;
    tenants?: Record<string, string>;
    initOptions?: InitMultiTenancyOptions;
  };
  logger?: AbimongoLoggerSettings;
  graphql?: {
    enabled?: boolean;
    subscriptions?: boolean;
    playground?: boolean;
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
  compressLogFiles?: {
    enabled?: boolean;
  },
  enableMetrics?: {
    enabled?: boolean;
    logInterval?: number; // in milliseconds
  },
  advanced?: {
    autoInstall?: boolean;
    circuitBreaker?: {
      enabled?: boolean;
      retryAttempts?: number;
    };
    garbageCollector?: {
      enabled?: boolean;
      retentionPeriod?: number | string;
      logResults?: boolean;
    };
    gcCron?: string;
  };
}

export interface AbimongoConfigFile {
  projectName?: string;
  mongoUri: string;
  multiTenant?: AbimongoConfig['multiTenant'];
  logger?: AbimongoLoggerSettings;
  graphql?: AbimongoConfig['graphql'];
  features?: AbimongoConfig['features'];
  advanced?: AbimongoConfig['advanced'];
}

export interface ProjectOptions {
  projectName?: string;
  provider?: BootstrapClient;
  mongoClient?: BootstrapClient;
  connection?: {
    uri: string;
    options?: any;
  };
  model?: AbimongoModelOptions;
  schema?: SchemaDefinition<Document>;
  multiTenant?: {
    enabled?: boolean;
    headerKey?: string;
    tenants?: Record<string, string>;
    initOptions?: InitMultiTenancyOptions;
  };
  logger?: AbimongoLoggerSettings;
  graphql?: {
    enabled?: boolean;
    subscriptions?: boolean;
    playground?: boolean;
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
    autoInstall?: boolean;
    circuitBreaker?: {
      enabled?: boolean;
      retryAttempts?: number;
    };
    garbageCollector?: {
      enabled?: boolean;
      retentionPeriod?: number; // Retain data for a specified number of days
      logResults?: boolean; // Log results of garbage collection
    };
    gcCron?: string;
  };
}