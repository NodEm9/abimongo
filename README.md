<p align="center">
  <img src="./abimongo-brand/abimongo-logo_socials.png" width="420" alt="Abimongo Logo">
</p>

<h1 align="center">Abimongo</h1>
<p align="center">
  <strong>The Next-Gen MongoDB ORM/ODM Ecosystem</strong><br>
  Core • Logger • Create (CLI)
</p>

---
![Release workflow](https://github.com/NodEm9/abimongo/actions/workflows/release.yml/badge.svg) ![Docs deploy workflow](https://github.com/NodEm9/abimongo/actions/workflows/docs-deploy.yml/badge.svg) ![npm (core)](https://img.shields.io/npm/v/@abimongo/core.svg) ![npm (logger)](https://img.shields.io/npm/v/@abimongo/logger.svg) ![npm (create)](https://img.shields.io/npm/v/@abimongo/create.svg) ![Docs (GitHub Pages)](https://img.shields.io/website?label=docs&url=https%3A%2F%2Fnodem9.github.io%2Fabimongo%2F)

---

## Packages / Capabilities

- `@abimongo/core` – The main MongoDB ORM/ODM with multi-tenancy, GraphQL, Redis, and RBAC.
- `@abimongo/logger` – Structured, extensible logger designed for Abimongo and Node.js services.
- `@abimongo/create` – Scaffolding CLI to bootstrap Abimongo-powered projects.

See each package README in `./packages/*` for usage details.

 
 <!-- @abimong/core ![npm version](https://img.shields.io/npm/v/@abimongo/core.svg) | 
 @abimongo/logger ![npm version](https://img.shields.io/npm/v/@abimongo/logger.svg) |
 @abimongo/create  ![npm version](https://img.shields.io/npm/v/@abimongo/create.svg) -->


Abimongo is a set of packages that provide a TypeScript-first ODM/ORM and developer tooling for MongoDB.

Release note (today)

- @abimongo/core now ships a CLI binary named `abimongo` which can scaffold new projects (`npx abimongo init <name>`).
- The CLI supports an opt-in `--install` flag to automatically install dependencies during scaffold. By default the scaffold will NOT run package installs (safer for CI/offline usage).
- The core logger has an environment guard so the CLI wrapper can disable process-level signal handlers during scaffold runs (prevents early shutdown in embedded contexts).

See `packages/core/README.md` and the docs site for full CLI and scaffolding guidance.

## Packages

| Package | Version | npm |
|---|---:|---|
| @abimongo/core | 1.1.4 | [npm](https://www.npmjs.com/package/@abimongo/core) |
| @abimongo/logger | 2.0.0 | [npm](https://www.npmjs.com/package/@abimongo/logger) |
| @abimongo/create | 1.0.4 | [npm](https://www.npmjs.com/package/@abimongo/create) |

## Docs

The documentation site is published to GitHub Pages. If you just updated the logo, build and deploy completed locally — the site lives at the repository Pages URL.

## Quick checks I ran

- Confirmed published versions on npm: `core@1.1.1`, `logger@1.1.1`, `create@1.0.1`.
- Built the docs locally and generated static files at `docs/website/build`.

If you want, I can also add dynamic npm version badges (shields) and link the docs URL directly — tell me if you want badges in this README and in package READMEs.

### Badges

![Release workflow](https://github.com/NodEm9/abimongo/actions/workflows/release.yml/badge.svg)
![Docs deploy workflow](https://github.com/NodEm9/abimongo/actions/workflows/docs-deploy.yml/badge.svg)
![npm (core)](https://img.shields.io/npm/v/@abimongo/core.svg)
![npm (logger)](https://img.shields.io/npm/v/@abimongo/logger.svg)
![npm (create)](https://img.shields.io/npm/v/@abimongo/create.svg)
![Docs (GitHub Pages)](https://img.shields.io/website?label=docs&url=https%3A%2F%2Fnodem9.github.io%2Fabimongo%2F)
