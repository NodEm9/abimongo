
# Abimongo Create (scaffolder)

The Abimongo Create tool is a project scaffolding utility. It creates starter applications (for example: MERN, Next.js, REST API, and GraphQL projects) and wiring for common project types. The tool is intentionally light: it scaffolds projects and developer tooling rather than exposing a runtime API.

How this differs from AbimongoBootstrap (core)

- The AbimongoBootstrap classes in `@abimongo/core` are programmatic helpers used inside applications and libraries. They are part of the runtime library surface and are documented in the core package docs.
-- The `@abimongo/create` package is a separate scaffolding utility: it generates project skeletons and optionally installs `@abimongo/core` and `@abimongo/logger` when you choose to include them during the interactive prompts.

Purpose and scope

- Purpose: scaffold full-stack starter projects and developer templates (MERN, Next.js, REST API, GraphQL, etc.).
- Scope: project generation, template wiring, and CI-friendly bootstrap scripts. The CLI does not add or document runtime APIs — consumers should consult `@abimongo/core` for runtime behavior and classes.

Installation

You can run the CLI without a global install using npm/yarn exec helpers. From a project root:


```bash
# npm
npx @abimongo/create <command> [options]

# yarn
yarn dlx @abimongo/create <command> [options]

# or use npm exec when installed as a dev dependency
npm exec --package @abimongo/create -- @abimongo/create <command>
```

Quick usage

View help and commands:

```bash
npx @abimongo/create --help
```

Initialize a new scaffolded project (interactive):

```bash
npx @abimongo/create init
```

Generate a template or resource:

```bash
npx @abimongo/create generate <template-name> [options]
```

Common commands

- `init` — interactive project scaffolding (choose project type, add optional packages).
- `generate` (or `gen`) — create templates, models, or other project artifacts.
- `config` — inspect or update CLI/project config used by templates.
- `help` — show available commands and flags.

Notes on optional installs

During scaffolding the CLI can offer to install `@abimongo/core` and `@abimongo/logger` into the generated project. If you accept, those packages will be added as project dependencies; otherwise the scaffold will include usage notes so you can add them later.

CLI changes (note)

- `@abimongo/core` now ships a top-level binary named `abimongo`. You can run the core scaffolder directly via npx:

```bash
npx abimongo init
```

- By default the scaffolder will NOT run package manager installs. This keeps the CLI fast and safe for CI and offline environments. If you want the scaffold to auto-install dependencies into the generated project pass `--install`.

```bash
npx abimongo init --install
```

- The CLI sets an environment guard so the logger and other long-running subsystems do not register process-level signal handlers when the binary is run as a one-off process. This prevents early shutdowns and makes the CLI safer to invoke from other tools or test harnesses.

Documentation guidance

- This package contains minimal docs because it does not expose programmable runtime APIs that need reference documentation. For API-level documentation, consult the `@abimongo/core` and `@abimongo/logger` packages.
- For examples and templates shipped with the CLI, see the `packages/cli/examples` folder in this repository.

Troubleshooting

- If a command doesn't match, run `npx @abimongo/create --help` to confirm the available commands and flags.
- Run the CLI from your workspace root in monorepos so templates and shared config can be located.
