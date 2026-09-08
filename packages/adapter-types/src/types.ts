export interface AbimongoRequestLike {
  headers: Record<string, string | string[] | undefined>;
  url?: string;
  method?: string;
  params?: Record<string, string>;
  cookies?: Record<string, string>;
  get?(name: string): string | undefined;
}

export interface AbimongoResponseLike {
  status?(code: number): this | void;
  setHeader?(name: string, value: string): void;
}

export type TenantResolver = (
  req: AbimongoRequestLike
) => Promise<string | undefined> | string | undefined;

export interface TenancyOptions {
  header?: string;
  cookie?: string;
  param?: string;
  subdomain?: boolean;
  jwtClaim?: string;
  fallback?: string;
  validate?: (id: string) => boolean | Promise<boolean>;
  resolver?: TenantResolver;
}

export interface AdapterContextOptions {
  tenancy?: TenancyOptions;
  enableTransactions?: boolean;
  requestIdHeader?: string;
}

export interface AbimongoAdapter<TApp = unknown> {
  name: string;
  install(app: TApp, options?: AdapterContextOptions): void | Promise<void>;
};