# Abimongo

Abimongo is a set of packages that provide a TypeScript-first ODM/ORM and developer tooling for MongoDB.

Release note (today)

- @abimongo/core now ships a CLI binary named `abimongo` which can scaffold new projects (`npx abimongo init <name>`).
- The CLI supports an opt-in `--install` flag to automatically install dependencies during scaffold. By default the scaffold will NOT run package installs (safer for CI/offline usage).
- The core logger has an environment guard so the CLI wrapper can disable process-level signal handlers during scaffold runs (prevents early shutdown in embedded contexts).

See `packages/core/README.md` and the docs site for full CLI and scaffolding guidance.
