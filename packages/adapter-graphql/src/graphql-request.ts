import type { AbimongoRequestLike } from '@abimongo/adapter-types';

function normalizeHeaders(
  headers: unknown
): Record<string, string | string[] | undefined> {
  if (!headers) return {};

  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key.toLowerCase()] = value;
    });
    return result;
  }

  if (typeof headers === 'object') {
    const result: Record<string, string | string[] | undefined> = {};

    for (const [key, value] of Object.entries(headers as Record<string, unknown>)) {
      if (typeof value === 'string' || Array.isArray(value) || value === undefined) {
        result[key.toLowerCase()] = value as string | string[] | undefined;
      } else if (value != null) {
        result[key.toLowerCase()] = String(value);
      }
    }

    return result;
  }

  return {};
}

export function toGraphqlAbimongoRequestLike(input: {
  headers?: unknown;
  url?: string;
  method?: string;
  cookies?: Record<string, string | undefined>;
}): AbimongoRequestLike {
  const headers = normalizeHeaders(input.headers);

  const cookies =
    input.cookies && typeof input.cookies === 'object'
      ? Object.fromEntries(
          Object.entries(input.cookies).map(([key, value]) => [key, value ?? ''])
        )
      : undefined;

  return {
    headers,
    url: input.url,
    method: input.method,
    cookies,
    params: {},
    get(name: string) {
      const value = headers[name.toLowerCase()];
      return Array.isArray(value) ? value[0] : value;
    }
  };
}