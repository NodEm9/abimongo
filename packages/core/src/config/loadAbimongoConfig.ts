import fs from 'fs-extra';
import path from 'path';
// import { Ajv } from 'ajv';
import type { ValidateFunction } from 'ajv';
import type { AbimongoConfig } from '../types/AbimongoConfig.js';
import configSchema from './abimongo.config.schema.json' with { type: 'json' };
import AjvLib from 'ajv';
// @ts-ignore
const Ajv = AjvLib.default || AjvLib;


const ajv = new Ajv({
  allErrors: true,
  useDefaults: true,
  strict: false, // Allow additional properties not defined in the schema
  coerceTypes: true, // Automatically convert types to match the schema
});

let validate: ValidateFunction | null = null;

const DEFAULT_CONFIG_FILENAME = 'abimongo.config.json';

/**
 * Loads and validates the Abimongo configuration from a JSON file.
 * 
 * @param {string} [configPath] - Optional path to the configuration file.
 * @returns {Promise<AbimongoConfig>} - The validated Abimongo configuration.
 * @throws {Error} If the config file is not found or is invalid.
 */
export async function loadAbimongoConfig(configPath?: string): Promise<AbimongoConfig> {
  // Candidate locations (test runners and consumers may use different cwd)
  const candidates = configPath
    ? [path.resolve(configPath)]
    : [
      // typical project root config
      path.resolve(process.cwd(), DEFAULT_CONFIG_FILENAME),
      // when running tests from package root: look under src/config/
      path.resolve(process.cwd(), 'src', 'config', DEFAULT_CONFIG_FILENAME),
      // possible local config folder next to this module
      path.resolve(__dirname, DEFAULT_CONFIG_FILENAME),
      // one level up from compiled dist layout
      path.resolve(__dirname, '..', DEFAULT_CONFIG_FILENAME),
      // fallback to a config folder in package root
      path.resolve(process.cwd(), 'config', DEFAULT_CONFIG_FILENAME),
    ];

  let finalPath: string | undefined;
  for (const candidate of candidates) {
    // eslint-disable-next-line no-await-in-loop
    if (await fs.pathExists(candidate)) {
      finalPath = candidate;
      break;
    }
  }

  if (!finalPath) {
    throw new Error(`Config file not found at any of: ${candidates.join(', ')}`);
  }

  const raw = await fs.readFile(finalPath, 'utf-8');
  let parsed: AbimongoConfig;

  try {
    parsed = JSON.parse(raw);

    // Defensive normalization: if consumers provided booleans for certain
    // config sections (e.g. "logger": false), Ajv with `useDefaults` will
    // attempt to assign default properties onto those primitives which
    // throws a TypeError. Convert known boolean shorthand fields into
    // objects before validation so defaults can be applied safely.
    const normalize = (cfg: any) => {
      // Normalize shorthand boolean/primitive shapes into predictable objects
      if (typeof cfg.logger === 'boolean') cfg.logger = { enabled: cfg.logger };
      if (!cfg.logger) cfg.logger = { enabled: false };

      // Normalize logger option shapes: allow either boolean or object.
      const normalizeLoggerOption = (v: any, optsName = 'enableMetrics') => {
        // If already an object with enabled property, keep object and coerce enabled/logInterval
        if (v && typeof v === 'object') {
          const out: any = {};
          out.enabled = typeof v.enabled === 'boolean' ? v.enabled : Boolean(v.enabled ?? false);
          // Accept either logInterval or logIntervalMs from older configs
          if (typeof v.logInterval === 'number') out.logInterval = v.logInterval;
          else if (typeof v.logIntervalMs === 'number') out.logInterval = v.logIntervalMs;
          return out;
        }

        // Primitive values -> boolean shorthand
        if (typeof v === 'boolean') return v;
        if (typeof v === 'string') {
          const s = (v || '').toString().trim().toLowerCase();
          if (s === 'true') return true;
          if (s === 'false') return false;
        }
        if (typeof v === 'number') return v !== 0;

        // Default
        return false;
      };

      // Assign without forcing primitive-only shapes: keep objects if provided
      try {
        cfg.logger.enableMetrics = normalizeLoggerOption(cfg.logger.enableMetrics, 'enableMetrics');
      } catch (e) {
        cfg.logger.enableMetrics = false;
      }

      try {
        cfg.logger.compressLogFiles = normalizeLoggerOption(cfg.logger.compressLogFiles, 'compressLogFiles');
      } catch (e) {
        cfg.logger.compressLogFiles = false;
      }

      if (typeof cfg.graphql === 'boolean') cfg.graphql = { enabled: cfg.graphql };
      if (!cfg.graphql) cfg.graphql = { enabled: false };

      if (!cfg.features) cfg.features = { useRedisCache: false };
      if (typeof cfg.features?.useRedisCache === 'undefined') cfg.features.useRedisCache = false;

      if (typeof cfg.advanced === 'boolean') cfg.advanced = { garbageCollector: { enabled: cfg.advanced } };
      if (!cfg.advanced) cfg.advanced = { garbageCollector: { enabled: false }, circuitBreaker: { enabled: false } };
      if (typeof cfg.advanced.garbageCollector === 'boolean') cfg.advanced.garbageCollector = { enabled: cfg.advanced.garbageCollector };

      return cfg;
    };

    parsed = normalize(parsed) as AbimongoConfig;
    if (!validate) {
      validate = ajv.compile(configSchema);
    }

    const isValid = validate!(parsed);

    if (!isValid && validate?.errors) {
      console.error('[Abimongo] Invalid configuration:');
      console.error(validate.errors);
      process.exit(1);
    }
  } catch (err) {
    throw new Error(`[Abimongo] Failed to parse config file: ${err}`);
  }

  // Basic validation
  if (!parsed.projectName || !parsed.connection?.uri) {
    throw new Error('Invalid config: "projectName" and "mongoUri" are required.');
  }

  if(parsed.provider && parsed.mongoClient) {
    throw new Error('Invalid config: "provider" and "mongoClient" cannot both be provided. Please choose one.');
  } else if (!parsed.provider && !parsed.mongoClient) {
    throw new Error('Invalid config: Either "provider" or "mongoClient" must be provided.');
  }

  // Provide sensible defaults
  parsed.graphql ??= { enabled: false };
  parsed.features ??= { useRedisCache: false };
  parsed.advanced ??= { garbageCollector: { enabled: true }, circuitBreaker: { enabled: false } };
  return parsed;
};