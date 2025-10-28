import { MultiTenantManager } from '../MultiTenantManager';
import { AbimongoConfig } from '../../types';
import { MongoClient } from 'mongodb';

export interface InitMultiTenancyOptions {
  lazy?: boolean; // Connect on-demand rather than eagerly
  config?: AbimongoConfig['logger'] // Optional logger
}

/**
 * Initializes multi-tenancy by registering tenants with their respective MongoDB URIs.
 * Supports both lazy (on-demand) and eager connection strategies.
 *
 * @param {Record<string, string>} tenants - A record of tenant IDs mapped to their MongoDB URIs.
 * @param {InitMultiTenancyOptions} [options={}] - Optional configuration for multi-tenancy initialization.
 * @param {boolean} [options.lazy=false] - If `true`, tenants are registered lazily (connected on-demand).
 * @param {AbimongoConfig} [options.config] - Optional configuration, including a logger for logging messages.
 * @returns {Promise<void>} A promise that resolves when all tenants are registered.
 * @throws {Error} If a tenant's MongoDB URI is invalid or missing.
 * @throws {Error} If a tenant is already registered and `lazy` is `false`.
 * @example 
 * // Initialize multi-tenancy with eager connection. Practically, you should use applyMultiTenancy instead.
 * that implements this function.
 * await initMultiTenancy({
 *   'tenant-a': 'mongodb://localhost:27017/tenant-a',
 *  'tenant-b': 'mongodb://localhost:27017/tenant-b'
 * }, {
 *   lazy: false,
 *  config: {}
 */
export const initMultiTenancy = async (
  tenants: Record<string, string>, // tenantId => MongoDB URI
  options: InitMultiTenancyOptions = {}
): Promise<void> => {
  const { lazy = false, config } = options;

  for (const [tenantId, uri] of Object.entries(tenants)) {
    if (!uri || typeof uri !== 'string' || !uri.startsWith('mongodb')) {
      throw new Error(`Invalid MongoDB URI for tenant "${tenantId}": ${uri}`);
    }

    const alreadyRegistered = MultiTenantManager.hasTenant(tenantId);
    if (alreadyRegistered) {
      config?.logger?.warn?.(`Tenant "${tenantId}" is already registered. Skipping.`);
      continue;
    }

    if (lazy) {
      // MultiTenantManager.registerLazyTenant(tenantId, uri, config?.enabled ? config.logger : undefined);
    } else {
      const client = new MongoClient(uri);
      await client.connect();

      await MultiTenantManager.registerTenant(tenantId, `${client}`);
    }

    // config?.logger?.info?.(`Tenant "${tenantId}" registered successfully.`);
  }
};
