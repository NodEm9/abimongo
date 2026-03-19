import { AbimongoContext } from '../context/AbimongoContext';
import { MultiTenantManager } from '../tanancy';
import type { ModelContext, BootstrapClient } from '../types';

export function configureAbimongoContext(provider: BootstrapClient): void {
  AbimongoContext.configureTransactionResolver({
    resolveClient: async (tenantId?: string, dbName?: string) => {
      if (tenantId) {
        const tenantClient = await MultiTenantManager.getClient(tenantId);
        if (tenantClient) return tenantClient;
      }

      if (provider.client) {
        const ctx: ModelContext = {
          tenantId,
          dbName
        };

        return await provider.client(ctx);
      }

      return undefined;
    }
  });
}