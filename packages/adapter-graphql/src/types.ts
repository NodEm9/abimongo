import type { AdapterContextOptions, AbimongoRequestLike } from '@abimongo/adapter-types';

export interface GraphqlAdapterOptions extends AdapterContextOptions {}

export interface GraphqlExecutionInput {
  request: AbimongoRequestLike;
}

export type GraphqlContextFactory<TSource = unknown, TResult = unknown> = (
  input: TSource
) => Promise<TResult> | TResult;