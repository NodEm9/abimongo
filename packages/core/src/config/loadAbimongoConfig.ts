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
  const finalPath = configPath
    ? path.resolve(configPath)
    : path.resolve(process.cwd(), DEFAULT_CONFIG_FILENAME);

  if (!(await fs.pathExists(finalPath))) {
    throw new Error(`Config file not found at ${finalPath}`);
  }

  const raw = await fs.readFile(finalPath, 'utf-8');
  let parsed: AbimongoConfig;

  try {
    parsed = JSON.parse(raw);
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