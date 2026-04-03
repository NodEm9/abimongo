import { AbimongoContext } from '@abimongo/core';
import { resolveTenant } from '@abimongo/adapter-types';
import type {
  AbimongoRequestLike,
  AdapterContextOptions
} from '@abimongo/adapter-types';


export async function runWithAdapterContext<T>(
  req: AbimongoRequestLike,
  handler: () => T | Promise<T>,
  options: AdapterContextOptions = {}
): Promise<T> {
  const {
    tenancy,
    enableTransactions = false,
    requestIdHeader = 'x-request-id'
  } = options;

  const tenantId = tenancy ? await resolveTenant(req, tenancy) : undefined;

  if (tenancy && !tenantId) {
    throw new Error('Tenant resolution failed.');
  }

  if (tenantId && tenancy?.validate) {
    const isValid = await tenancy.validate(tenantId);
    if (!isValid) {
      throw new Error(`Invalid tenant ID: ${tenantId}`);
    }
  }

  const rawRequestId = req.headers?.[requestIdHeader.toLowerCase()];
  const requestId = Array.isArray(rawRequestId) ? rawRequestId[0] : rawRequestId;

  const ctx = {
    tenantId,
    requestId
  };

  if (enableTransactions) {
    return AbimongoContext.run(ctx, () =>
      AbimongoContext.withTransaction(async () => await handler())
    );
  }

  return AbimongoContext.run(ctx, async () => await handler());
};