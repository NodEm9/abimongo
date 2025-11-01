import fs from 'fs-extra';
import path from 'path';
import Ajv, { ValidateFunction } from 'ajv';
import { AbimongoConfig } from '../types';
import configSchema from './abimongo.config.schema.json';


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
      if (typeof cfg.logger === 'boolean') cfg.logger = { enabled: cfg.logger };
      if (!cfg.logger) cfg.logger = { enabled: false };

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

    const isValid = validate(parsed);

    if (!isValid && validate.errors) {
      console.error('[Abimongo] Invalid configuration:');
      console.error(validate.errors);
      process.exit(1);
    }
  } catch (err) {
    throw new Error(`[Abimongo] Failed to parse config file: ${err}`);
  }

  // Basic validation
  if (!parsed.projectName || !parsed.mongoUri) {
    throw new Error('Invalid config: "projectName" and "mongoUri" are required.');
  }

  // Provide sensible defaults
  parsed.graphql ??= { enabled: false };
  parsed.features ??= { useRedisCache: false };
  parsed.advanced ??= { garbageCollector: { enabled: true }, circuitBreaker: { enabled: false } };
  return parsed;
};