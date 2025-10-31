# @abimongo/cli

This package is a lightweight CLI shim for Abimongo. It re-exports the `AbimongoBootstrap` API from `@abimongo/core` and exposes a `scaffold` command that delegates to the existing scaffolder in `@abimongo/create`.

Usage (local):

1. Build the workspace: `pnpm -w build`
2. Run the CLI: `npx @abimongo/cli scaffold` or `pnpm --filter @abimongo/cli run start` (when configured)

This package is intentionally minimal and non-invasive: it does not change runtime logic, only provides a clearer package surface for CLI tooling.
