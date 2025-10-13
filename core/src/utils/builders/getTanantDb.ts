import { Db } from 'mongodb';
import { abimongo } from '../../core';

const dbCache: Map<string, Db> = new Map();

/**
 * Retrieves the database instance for a specific tenant.
 * If the database is already cached, it returns the cached instance.
 * Otherwise, it uses `abimongo` to get the database for the tenant and caches it.
 *
 * @param {string} tenantId - The ID of the tenant whose database is to be retrieved.
 * @returns {Promise<Db>} A promise that resolves to the MongoDB database instance for the tenant.
 * @throws {Error} If the database for the specified tenant is not found.
 */
export const getTenantDB = async (tenantId: string): Promise<Db> => {
  if (dbCache.has(tenantId)) {
    return dbCache.get(tenantId)!;
  }
  const db = await abimongo.useDatabase(tenantId);
  if (!db) throw new Error(`Database not found for tenant: ${tenantId}`);
  dbCache.set(tenantId, db);
  return db;
}