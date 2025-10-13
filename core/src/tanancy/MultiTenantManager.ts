import { NoOpLogger, ILogger} from '@abimongo/logger';
import { MongoClient } from 'mongodb';

/**
 * Manages multi-tenancy by handling tenant-specific MongoDB connections.
 * Provides methods for registering tenants, retrieving clients, and supporting lazy connections.
 */
export class MultiTenantManager {
  private static clients: Map<string, MongoClient> = new Map();
  private static lazyURIs: Map<string, string> = new Map();

  constructor() {}

  /**
   * Checks if a tenant is already registered.
   * @param {string} tenantId - The ID of the tenant to check.
   * @returns {boolean} `true` if the tenant is registered, `false` otherwise.
   */
  static hasTenant(tenantId: string): boolean {
    return this.clients.has(tenantId) || this.lazyURIs.has(tenantId);
  }

  /**
   * Registers a tenant with the given ID and MongoDB URI for lazy connection.
   * Lazy connections are established only when the tenant is accessed for the first time.
   *
   * @param {string} tenantId - The ID of the tenant to register.
   * @param {string} uri - The MongoDB URI for the tenant.
   * @param {NoOpLogger | ILogger} [logger] - Optional logger for logging messages.
   */
  static registerLazyTenant(
    tenantId: string,
    uri: string,
    logger?: NoOpLogger | ILogger
  ): void {
    this.lazyURIs.set(tenantId, uri);
    logger?.info?.(`Tenant "${tenantId}" registered for lazy connection.`);
  }

  /**
   * Registers a tenant with the given ID and MongoDB URI.
   * If the tenant is already registered, it returns the existing client.
   *
   * @param {string} tenantId - The ID of the tenant to register.
   * @param {string} uri - The MongoDB URI for the tenant.
   * @returns {Promise<MongoClient>} A promise that resolves to the MongoClient instance for the tenant.
   */
  static async registerTenant(tenantId: string, uri: string): Promise<MongoClient> {
    if (!this.clients.has(tenantId)) {
      const client = new MongoClient(uri);
      await client.connect();
      this.clients.set(tenantId, client);
    }
    return this.clients.get(tenantId)!;
  }

  /**
   * Retrieves the MongoClient instance for a specific tenant.
   * If the tenant is registered for lazy connection, it establishes the connection before returning the client.
   *
   * @param {string} tenantId - The ID of the tenant to retrieve.
   * @returns {Promise<MongoClient | null>} A promise that resolves to the MongoClient instance or `null` if the tenant is not registered.
   */
  static async getClient(tenantId: string): Promise<MongoClient | null> {
    if (this.clients.has(tenantId)) return this.clients.get(tenantId)!;

    const uri = this.lazyURIs.get(tenantId);
    if (uri) {
      const client = new MongoClient(uri);
      await client.connect();
      this.clients.set(tenantId, client);
      this.lazyURIs.delete(tenantId);
      return client;
    }

    return null;
  }

  static getConnectedTenant(): string {
    return Array.from(this.clients.keys())[0] || '';
  }

  static getAllConnectedTenants(): string[] {
    return Array.from(this.clients.keys());
  }
}
