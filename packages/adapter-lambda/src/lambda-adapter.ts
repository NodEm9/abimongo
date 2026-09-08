import { runWithAdapterContext } from '@abimongo/adapter-runtime';
import type { LambdaAdapterOptions, LambdaHandlerLike, LambdaRequestInput } from './types.js';
import { toLambdaAbimongoRequestLike } from './lambda-request.js';

export function createLambdaAdapter<TEvent extends LambdaRequestInput, TResult>(
  handler: LambdaHandlerLike<TEvent, TResult>,
  options: LambdaAdapterOptions = {}
): LambdaHandlerLike<TEvent, TResult> {
  return async (event: TEvent, context?: unknown): Promise<TResult> => {
    const adaptedRequest = toLambdaAbimongoRequestLike(event);

    return runWithAdapterContext(
      adaptedRequest,
      async () => handler(event, context),
      options
    );
  };
}