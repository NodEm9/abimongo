import { Abimongo, AbimongoModel } from "../../lib-core"
import { AbimongoModelOptions, Document } from "../../types"; // Ensure the correct path to the document module


/**
 * Parameters for creating a new model.
 * @template T - The type of the document in the collection.
 */
type CreateModelParams<T extends Document = any> = AbimongoModelOptions<T>;

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
 * const userModel = Model({
 *   name: 'users',
 *   schema: userSchema,
 *   provider: (client/db - whichever you naming is)/new MyCustomDbProvider(), // Your custom database provider instance
 *   ctx: {
 *     tenantId: 'tenant-a', // Optional: specify tenant ID if using multi-tenancy
 *     dbName: 'myDatabase', // Optional: specify database name if needed
 * } read docs for more details on what context options you can provide
 * });
 */
export const Model = <T extends Document = any>(
  options: CreateModelParams<T>
): AbimongoModel<T> => {
  return new AbimongoModel<T>({
    ...options,
    provider: options.provider ?? Abimongo.init()
  });
}
