# @abimongo/cli

## 1.1.0

### Minor Changes

- [#3](https://github.com/NodEm9/abimongo/pull/3) [`868ff7d`](https://github.com/NodEm9/abimongo/commit/868ff7d9f7ddd830a6d190a5a7e140538411ad2d) Thanks [@NodEm9](https://github.com/NodEm9)! - Add a new, non-invasive CLI package, `@abimongo/cli`, that provides an Abimongo-first `init` command
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

- [#3](https://github.com/NodEm9/abimongo/pull/3) [`ad3ca22`](https://github.com/NodEm9/abimongo/commit/ad3ca224fc87d76524274be10a58f6c31f08510d) Thanks [@NodEm9](https://github.com/NodEm9)! - Add a new `@abimongo/cli` package that provides an Abimongo-first `init` command (programmatic bootstrap via `AbimongoBootstrap`) and a `scaffold` command that delegates to `@abimongo/create` for interactive scaffolding. The CLI also detects the consumer's package manager and can optionally run install with `--install`.

  This change introduces the CLI shim package; it is backwards-compatible and opt-in for programmatic bootstrap.

### Patch Changes

- [#3](https://github.com/NodEm9/abimongo/pull/3) [`6b4ffe2`](https://github.com/NodEm9/abimongo/commit/6b4ffe2e547468151145b6d3be95e5b37957e35f) Thanks [@NodEm9](https://github.com/NodEm9)! - Prepare packages for registry publish: bump package versions by patch so workspace: dependencies are resolved to concrete versions when publishing.

- Updated dependencies [[`6b4ffe2`](https://github.com/NodEm9/abimongo/commit/6b4ffe2e547468151145b6d3be95e5b37957e35f)]:
  - @abimongo/core@1.1.0
  - @abimongo/create@1.0.1
