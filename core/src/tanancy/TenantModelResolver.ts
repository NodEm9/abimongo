import { AbimongoSchema } from '../core/AbimongoSchema';
import { MultiTenantManager } from './MultiTenantManager';
import { TenantContext } from './TenantContext';
import { createModel } from '../utils/builders/createModel';
import { ensureModelNameSafe } from '../utils/ensureModelNameSafe'; // <- wherever you put it
import { Document } from '../types';

/**
 * Parameters required to resolve a tenant-specific model.
 * @template T - The type of the document in the model.
 */
export type GetTanantModelParams<T extends Document> = {
  /**
   * The name of the model to resolve.
   */
  modelName: string;

  /**
   * The ID of the tenant for which the model is being resolved.
   */
  tenantId: string;

  /**
   * The schema definition for the model (optional).
   */
  schema?: AbimongoSchema<T>;
};

const tenantModelsCache = new WeakMap<any, Map<string, any>>();

/**
 * Resolves a tenant-specific model by creating or retrieving it from the cache.
 * Ensures that each tenant has its own isolated model instance.
 *
 * @template T - The type of the document in the model.
 * @param {GetTanantModelParams<T>} param - The parameters required to resolve the model.
 * @param {string} param.modelName - The name of the model to resolve.
 * @param {AbimongoSchema<T>} [param.schema] - The schema definition for the model (optional).
 * @param {string} param.tenantId - The ID of the tenant for which the model is being resolved.
 * @returns {Promise<any>} A promise that resolves to the tenant-specific model instance.
 * @throws {Error} If no tenant context is found or the tenant is not registered.
 * @example
 * const userModel = await getTenantModel({
 *  modelName: 'User',
 *  schema: UserSchema,
 *  tenantId: 'tenant123'
 * });
 * // userModel is now a tenant-specific model for the 'User' collection in 'tenant123'
 * @example
 * const productModel = await getTenantModel({
 *  modelName: 'Product',
 *  schema: ProductSchema,
 *  tenantId: 'tenant456'
 * });
 */
export const getTenantModel = async <T extends Document>(param: GetTanantModelParams<T>): Promise<any> => {
  const safeModelName = ensureModelNameSafe(param.modelName);
  const schema = param.schema;
  const tenantId = param.tenantId || TenantContext.getTenantId();

  if (!tenantId) throw new Error('No tenant context found');

  const client = await MultiTenantManager.getClient(tenantId);
  if (!client) throw new Error(`Tenant "${tenantId}" not registered`);

  if (!tenantModelsCache.has(client)) {
    tenantModelsCache.set(client, new Map());
  }

  const clientCache = tenantModelsCache.get(client)!;

  if (clientCache.has(safeModelName)) {
    return clientCache.get(safeModelName);
  }

  const model = createModel({ name: safeModelName, schema, client });
  clientCache.set(safeModelName, model);

  return model;
};
