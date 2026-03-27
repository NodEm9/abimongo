import { AbimongoContext } from '@abimongo/core';
import { resolveTenant } from '@abimongo/adapter-types';
import type {
  AbimongoRequestLike,
  AdapterContextOptions
} from '@abimongo/adapter-types';

function readRequestId(
  req: AbimongoRequestLike,
  headerName: string
): string | undefined {
  const value = req.headers?.[headerName.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

export async function runWithAdapterContext<T>(
  req: AbimongoRequestLike,
  handler: () => Promise<T>,
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

  const requestId = readRequestId(req, requestIdHeader);

  const ctx = {
    tenantId,
    requestId
  };

  if (enableTransactions) {
    return AbimongoContext.run(ctx, () =>
      AbimongoContext.withTransaction(async () => handler())
    );
  }

  return AbimongoContext.run(ctx, handler);
}
