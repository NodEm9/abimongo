# Abimongo CLI (shim)

`@abimongo/cli` is a lightweight, non-invasive CLI shim that provides two complementary workflows:

- Abimongo-first programmatic init (recommended for advanced users / automation): it writes a starter `abimongo.config.json`, a minimal `package.json`, and optionally runs the consumer package manager to install dependencies; then it attempts to programmatically initialize `@abimongo/core` (via `AbimongoBootstrap`) to validate the generated configuration.

- Interactive scaffolding fallback: delegates to the existing `@abimongo/create` scaffolder for the familiar interactive project templates (MERN, Next.js, REST, GraphQL, etc.). To preserve interactive TTY behavior, the shim delegates by spawning the bundled `@abimongo/create` CLI.

Why this shim?

- Provide an "Abimongo-first" experience for users who want to programmatically create and validate a project using `@abimongo/core`.
- Preserve the existing `@abimongo/create` interactive experience for full project scaffolding without duplicating templates.
- Detect and adapt to the consumer package manager (`pnpm`, `yarn`, or `npm`), with an optional `--install` flag to run dependency installation automatically.

Quick start

From the monorepo or after installing the package (global or via npx):

```bash
# programmatic-first initialization (writes files and attempts bootstrap)
npx @abimongo/cli init my-app

# initialize and try to install dependencies using detected package manager
npx @abimongo/cli init my-app --install

# delegate to the interactive scaffolder (same templates as @abimongo/create)
npx @abimongo/cli scaffold
```

Notes and gotchas

- The `init` command writes `abimongo.config.json` and a minimal `package.json` in the target folder. If `--install` is provided the CLI will attempt to run the detected package manager in the target directory. Auto-install attempts may behave differently per OS and shell; the CLI retries with a live stdio fallback when a captured spawn shows unexpected behavior.

- Programmatic bootstrap uses `AbimongoBootstrap.initialize(configPath)` from `@abimongo/core`. If networked services (MongoDB, Redis) are unreachable the bootstrap attempt may fail — this is logged as non-fatal so the generated project is still available.

- The interactive `scaffold` command simply forwards to `@abimongo/create` (bundled) to keep templates and UX in a single place.

Migration notes (from using `@abimongo/create` directly)

- If you previously used `npx @abimongo/create init` and want Abimongo-first validation, switch to `npx @abimongo/cli init`.
- If you prefer the interactive flow you can keep using `@abimongo/create` or call `@abimongo/cli scaffold` which forwards to the same templates.

Troubleshooting

- If `--install` fails due to your shell or PATH shims, run the install manually in the created folder:

```bash
cd my-app
pnpm install # or npm install
```

- For programmatic bootstrap errors, inspect the generated `abimongo.config.json` (the CLI attempts to normalize common boolean vs object shapes) and ensure `mongoUri` (and any redis/tenant URIs) are reachable if you expect bootstrap to fully connect.

Feedback

If you want more detailed docs for specific CLI commands (for example, step-by-step flags for `init`), tell me which command and I will add a dedicated doc page with examples.
