# @abimongo/cli

## 1.1.1

### Patch Changes

- Updated dependencies
  - @abimongo/core@1.1.1
  - @abimongo/logger@1.1.1
  - @abimongo/create@1.0.1

## 1.1.0

### Minor Changes

- 868ff7d: Add a new, non-invasive CLI package, `@abimongo/cli`, that provides an Abimongo-first `init` command
  and a `scaffold` command which delegates to the existing scaffolder. The CLI preserves the
  existing `@abimongo/create` behavior while making programmatic bootstrap opt-in (via
  `--bootstrap`) to avoid blocking package-manager flows. This release includes configuration
  normalization, logger hardening, safer Redis handling, and tests to make bootstrap stable in CI.

  Highlights

  - New package: `@abimongo/cli` (non-invasive shim that prefers Abimongo-first initialization)
  - Programmatic bootstrap is opt-in (`--bootstrap` / `--validate`) to avoid PM hooks breaking
  - Config normalizer to prevent boolean-shorthand TypeErrors
  - Hardened logger initialization and default file transport fallback
  - Safer Redis client management (per-URL clients, RedisService, suppressed reconnect logs in tests)
  - Unit and deterministic integration tests added for Redis-absent flows

  See the PR draft (./.github/PULL_REQUEST_TEMPLATE/cli-release.md) for full testing and release steps.

- ad3ca22: Add a new `@abimongo/cli` package that provides an Abimongo-first `init` command (programmatic bootstrap via `AbimongoBootstrap`) and a `scaffold` command that delegates to `@abimongo/create` for interactive scaffolding. The CLI also detects the consumer's package manager and can optionally run install with `--install`.

  This change introduces the CLI shim package; it is backwards-compatible and opt-in for programmatic bootstrap.
