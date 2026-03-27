import { MultiTenantManager, TenantContext } from "../../tanancy/index.js";

export async function getTenantClientOrThrow() {
  const tenantId = TenantContext.getTenantId();
  if (!tenantId) throw new Error("No tenant in context");
  const client = await MultiTenantManager.getClient(tenantId);
  if (!client) throw new Error(`Tenant not registered: ${tenantId}`);
  return client;
}