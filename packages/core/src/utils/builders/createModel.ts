import { Db, MongoClient } from "mongodb";
import { AbimongoModel, AbimongoSchema } from "../../lib-core"
import { Document } from "../../types"; // Ensure the correct path to the document module


/**
 * Parameters for creating a new model.
 * @template T - The type of the document in the collection.
 */
interface CreateModelParams<T extends Document = any> {
  name: string;
  schema?: AbimongoSchema<T>;
  tenantId?: string;
  db?: Db;
  client?: MongoClient;
}

/**
 * Creates a new model for a MongoDB collection.
 * In Multi-Tenancy mode, the model will be created for the specified tenant.
 * If no tenant ID is provided, the model will be created for the default tenant. 
 * Note: Once a the applyMultiTenancy() middleware is applied to a connection to register tenant/s, the tenantId will be automatically set for all models created after that.
 * This allows you to create models for different tenants without having to specify the tenantId each time. Then a tenantId or db instance or client instance is required to create a model.
 * @template T - The type of the document in the collection.
 * @param {CreateModelParams<T>} params - The parameters for creating the model.
 * @returns {AbimongoModel<T>} The created model.
 *
 * @example
 * const userSchema = createSchema({
 *   name: { type: String, required: true },
 *   age: { type: Number, required: true },
 *   email: { type: String, required: true },
 * });
 *
 * const userModel = createModel({
 *   name: 'users',
 *   schema: userSchema,
 *   tenantId: 'tenant1', // Optional tenant ID for multi-tenancy
 *   db: dbInstance, // Your MongoDB Db instance
 *   client: mongoClient, // Your MongoDB Client instance
 * });
 */
export const createModel = <T extends Document = any>(
  params: CreateModelParams<T>
): AbimongoModel<T> => {
  return new AbimongoModel<T>({
    collectionName: params.name,
    schema: params.schema,
    tenantId: params.tenantId,
    db: params.db,
    client: params.client,
  });
}
