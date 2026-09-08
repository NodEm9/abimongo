import { runWithAdapterContext } from '@abimongo/adapter-runtime';
import type { GraphqlAdapterOptions } from './types.js';
import type { AbimongoRequestLike } from '@abimongo/adapter-types';

export async function runWithGraphqlContext<T>(
  request: AbimongoRequestLike,
  handler: () => T | Promise<T>,
  options: GraphqlAdapterOptions = {}
): Promise<T> {
  return runWithAdapterContext(request, handler, options);
}