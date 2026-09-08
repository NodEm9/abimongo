import type { AbimongoRequestLike } from '@abimongo/adapter-types';
import type { LambdaRequestInput } from './types.js';

function normalizeHeaders(
  headers?: Record<string, string | undefined> | null,
  multiValueHeaders?: Record<string, string[] | undefined> | null
): Record<string, string | string[] | undefined> {
  const result: Record<string, string | string[] | undefined> = {};

  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      result[key.toLowerCase()] = value;
    }
  }

  if (multiValueHeaders) {
    for (const [key, value] of Object.entries(multiValueHeaders)) {
      if (value && value.length > 0) {
        result[key.toLowerCase()] = value;
      }
    }
  }

  return result;
}

function normalizeCookies(cookieHeaders?: string[]): Record<string, string> | undefined {
  if (!cookieHeaders || cookieHeaders.length === 0) return undefined;

  const cookies: Record<string, string> = {};

  for (const cookieHeader of cookieHeaders) {
    const parts = cookieHeader.split(';');

    for (const part of parts) {
      const [rawKey, ...rawValue] = part.split('=');
      const key = rawKey?.trim();
      const value = rawValue.join('=').trim();

      if (key) {
        cookies[key] = value;
      }
    }
  }

  return Object.keys(cookies).length > 0 ? cookies : undefined;
}

export function toLambdaAbimongoRequestLike(
  event: LambdaRequestInput
): AbimongoRequestLike {
  const headers = normalizeHeaders(event.headers, event.multiValueHeaders);

  const params: Record<string, string> = {};

  for (const [key, value] of Object.entries(event.pathParameters ?? {})) {
    if (typeof value === 'string') {
      params[key] = value;
    }
  }

  const method =
    event.requestContext?.http?.method ??
    event.httpMethod;

  const url =
    event.rawPath ??
    event.requestContext?.http?.path ??
    event.path;

  const cookies = normalizeCookies(event.cookies);

  return {
    headers,
    url,
    method,
    params,
    cookies,
    get(name: string) {
      const value = headers[name.toLowerCase()];
      return Array.isArray(value) ? value[0] : value;
    }
  };
}