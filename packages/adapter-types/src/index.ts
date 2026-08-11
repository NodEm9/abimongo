export interface AbimongoRequestLike {
  headers: Record<string, string | string[] | undefined>;
  url?: string;
  method?: string;
  params?: Record<string, string>;
  cookies?: Record<string, string>;
  get?(name: string): string | undefined; // express-style
}

export interface AbimongoResponseLike {
  status?(code: number): this | void;
  setHeader?(name: string, value: string): void;
}

export interface AbimongoContext {
  tenantId: string;
}

export type TenantResolver = (req: AbimongoRequestLike) => Promise<string> | string;

export interface TenancyOptions {
  header?: string;     // default: x-tenant-id
  cookie?: string;     // e.g., tenant
  param?: string;      // e.g., tenantId
  subdomain?: boolean; // parse from host
  jwtClaim?: string;   // dot path e.g., "tenantId" or "custom:tenant"
  fallback?: string;   // default tenant
  validate?: (id: string) => boolean | Promise<boolean>;
}

export interface AbimongoAdapter<TApp = unknown> {
  name: string;
  installTenancy(app: TApp, config: {
    tenants: Record<string, string>;
    headerKey?: string;
    initOptions?: any;
  }): Promise<void> | void;
}


function readHeader(req: AbimongoRequestLike, name: string): string | undefined {
  const h = req.headers?.[name.toLowerCase()];
  if (!h) return undefined;
  return Array.isArray(h) ? h[0] : h;
}

function fromSubdomain(req: AbimongoRequestLike): string | undefined {
  const host = readHeader(req, "host");
  if (!host) return undefined;
  // strip port if present
  const hostname = host.split(":")[0];
  const parts = hostname.split(".");
  if (parts.length < 3) return undefined; // e.g., api.example.com (no subdomain)
  return parts[0]; // tenant.example.com -> tenant
}

export function resolveTenant(
  req: AbimongoRequestLike,
  opts: TenancyOptions = {}
): string | undefined {
  const {
    header = "x-tenant-id",
    cookie,
    param,
    subdomain = false,
    jwtClaim,
    fallback
  } = opts;

  // 1) header
  const byHeader = readHeader(req, header);
  if (byHeader) return byHeader;

  // 2) cookie
  if (cookie && req.cookies && req.cookies[cookie]) {
    return req.cookies[cookie];
  }

  // 3) param (router param)
  if (param && req.params && req.params[param]) {
    return req.params[param];
  }

  // 4) subdomain
  if (subdomain) {
    const sd = fromSubdomain(req);
    if (sd) return sd;
  }

  // 5) JWT claim (very light heuristic, expects upstream to parse JWT & stuff into a header)
  if (jwtClaim) {
    const claimHeader = readHeader(req, "x-user-claims"); // JSON string set by your auth layer
    if (claimHeader) {
      try {
        const claims = JSON.parse(claimHeader);
        const segments = jwtClaim.split(".");
        let cur: any = claims;
        for (const seg of segments) {
          cur = cur?.[seg];
        }
        if (typeof cur === "string") return cur;
      } catch {/* ignore */}
    }
  }

  // 6) AbimongoAdapter (not implemented here, but could be an extension point)

  // 7) fallback
  return fallback;
}

export async function createTenancyContext(
  req: AbimongoRequestLike,
  opts: TenancyOptions = {}
): Promise<AbimongoContext> {
  const id = resolveTenant(req, opts);
  if (!id) throw new Error('Missing tenant ID. Provide header "x-tenant-id" or configure alternatives.');
  if (opts.validate) {
    const ok = await opts.validate(id);
    if (!ok) throw new Error(`Invalid tenant ID: ${id}`);
  }
  return { tenantId: id };
}
