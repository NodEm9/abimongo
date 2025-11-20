<p align="center">
  <img src="../../abimongo-brand/abimongo-logo_socials.png" width="360" alt="Abimongo Logo">
</p>

<h1 align="center">
 <div>Abimongo Create (scaffolder)</div>
@abimongo/create</h1>
<p align="center">
  <strong>Project Scaffolding for Abimongo</strong><br>
  MERN • Next.js • REST API • GraphQL API • Multi-Tenant Ready
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@abimongo/create">
    <img src="https://img.shields.io/npm/v/@abimongo/create.svg?style=flat-square&color=00C4B4" alt="npm version">
  </a>
  <a href="https://github.com/Nodem9/abimongo">
    <img src="https://img.shields.io/github/stars/Nodem9/abimongo?style=flat-square&color=1E88E5" alt="GitHub stars">
  </a>
</p>

---

 <!-- ![npm version](https://img.shields.io/npm/v/@abimongo/create.svg)
 ![Release workflow](https://github.com/NodEm9/abimongo/actions/workflows/release.yml/badge.svg) -->


The Abimongo CLI is a project scaffolding tool. It creates starter applications and wiring for common project types (for example: MERN, Next.js, REST API, and GraphQL). The CLI focuses on generating working project skeletons and developer tooling; it does not expose a runtime API surface that needs in-depth reference docs.

Key points

- Purpose: scaffold full-stack or API starter projects and templates.
- Scope: project generation, template wiring, and optional dependency installation.
- Minimal docs: this package intentionally contains minimal documentation because runtime API docs live in `@abimongo/core` and `@abimongo/logger`.

Optional installs

During interactive scaffolding the CLI can offer to install `@abimongo/core` and `@abimongo/logger` into the generated project. If you accept, those packages will be added as project dependencies and basic wiring will be included in the scaffold. If you decline, the scaffold will include notes so you can add them later.

Installation

You can run the CLI without a global install using npm or yarn exec helpers. From a project root:

```bash
# npm
npx @abimongo/create <command> [options]

# yarn
yarn dlx @abimongo/create <command> [options]

# or use npm exec when installed as a devDependency
npm exec --package @abimongo/create -- @abimongo/create <command>
```

Quick start

- Show help:

```bash
npx @abimongo/create --help
```

- Scaffold a new project (interactive):

```bash
npx @abimongo/create init
```

- Generate a template or artifact:

```bash
npx @abimongo/create generate <template-name>
```

Common commands

- init — interactive project scaffolding (choose project type, features, and optional packages).
- generate (or gen) — create templates, models, or other code artifacts.
- config — inspect or update CLI/project template configuration.
- help — list commands and flags.

Examples and templates

The CLI ships with example templates and usage notes. See the repository folder:

```
packages/cli/examples
```

When to use each package

- Use `@abimongo/create` when you want to bootstrap a new project quickly.
- Use `@abimongo/core` for runtime classes, configuration, and API-level usage (these are documented in the core package docs).

Troubleshooting

- If a command is unavailable, run `npx @abimongo/create --help` to confirm the available commands and flags.
- In monorepos, run the CLI from the workspace root so it can find shared templates and config.
- If you accept optional installs but the package manager fails, install `@abimongo/core` and `@abimongo/logger` manually in the generated project.

Contributing

Contributions to the CLI templates are welcome. If you add or modify templates, add corresponding example scaffolds under `packages/cli/examples` and include a short description of the template intent.

License

This package follows the repository license. See the top-level `LICENSE` file for details.

