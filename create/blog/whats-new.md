---
title: What’s Next for Abimongo v2 — Universal Adapters Are Coming
slug: Universal Adapters Are Coming
tags:
  - release
  - what's new
  - docs
author: Emmanuel Nodolomwanyi (Creator & Lead Maintainer, Abimongo Ecosystem)
image: /abimongo/img/abiimongo-logo.png
--- 

Since Abimongo’s launch, the community response has been incredible. Developers across multiple ecosystems have already begun exploring how its intelligent multi-tenancy, schema abstraction, and real-time hooks simplify complex MongoDB applications.

While **v1** successfully laid the foundation for a modern, scalable **MongoDB ORM/ODM**, the upcoming **v2 release** will take versatility and interoperability much further — through a new **universal adapter architecture** designed to integrate seamlessly with diverse runtime environments.

---

## Why Adapters Matter

Today, Abimongo’s multi-tenant API is optimized primarily for **Express** applications. Although Express remains widely adopted, the modern backend landscape now includes a rich mix of frameworks and execution models:

- Microservices (Fastify)
- Full enterprise application frameworks (NestJS)
- API-centric GraphQL servers
- Edge runtimes and serverless platforms
- Middleware-driven architectures like Koa and hapi

Developers expect database tools that **adapt to their stack— not the other way around**.

That is the core direction of **Abimongo v2**.

---

## Introducing the Adapter Ecosystem (V2 Preview)

Abimongo v2 will introduce a clean, standardized integration layer powered by a shared `@abimongo/adapter-types` core.  
Each adapter maps the underlying framework request shape to Abimongo’s universal **tenant context contract**, ensuring predictable DX across environments.

**Planned official adapters include:**

| Adapter Package                 | Target Framework / Runtime                  |
|--------------------------------|---------------------------------------------|
| `@abimongo/adapter-express`    | Express 4/5 REST APIs                        |
| `@abimongo/adapter-fastify`    | Fastify microservices & servers              |
| `@abimongo/adapter-nestjs`     | NestJS (HTTP + GraphQL)                      |
| `@abimongo/adapter-graphql`    | Apollo Server, Yoga, Mercurius, etc.         |
| `@abimongo/adapter-koa`        | Koa 2 middleware-based servers               |
| `@abimongo/adapter-hapi`       | hapi enterprise APIs + gateways              |

Community adapters will also be supported through a documented **adapter contract API**.

---

## A Framework-Agnostic Core

At the center of this ecosystem is the new **`@abimongo/adapter-types`** package, which provides:

```ts
interface AbimongoContext {
  tenantId: string;
}

function createTenancyContext(
  req: AbimongoRequestLike,
  options?: TenancyOptions
): Promise<AbimongoContext>;
```

If a developer can map headers, params, cookies, and URLs, they can use Abimongo — regardless of their application framework or request lifecycle.

## Developer-Experience Enhancements in v2

Abimongo v2 is not only about wider compatibility — it focuses on DX quality and maintainability. Expected enhancements include:

- Per-adapter guides and ready-to-copy examples

- More robust TypeDoc API surface and usage notes

- Clear multi-tenant testing utilities (mock & fixture helpers)

- Unified error message format and fault tolerance rules

- Optional framework detection & auto-configuration via CLI

## Release Timeline

The first public preview (Express, Fastify, NestJS, GraphQL) is scheduled for Q1 2026.
Subsequent releases will introduce Koa, hapi, and edge runtime adapters, followed by community-driven innovation.

If you want early access, feature discussions, or to contribute adapters, now is the best time to get involved.

## Final Note

Abimongo v2 represents a major milestone toward a universal, framework-agnostic MongoDB ORM/ODM, designed for real-world multi-tenant workloads and modern distributed applications.

The mission remains unchanged:

Empower developers to manage data complexity — intelligently, securely, and without friction.

Stay tuned for detailed release notes and upcoming preview builds right here on the blog.

Follow or contribute on GitHub:
🔗 https://github.com/NodEm9/abimongo

📣 Get Involved

💬 Join the community discussions
📁 Contribute features, issues, or docs
⭐ Star the GitHub repo to support development

Abimongo v2 — Adapt. Scale. Evolve.
