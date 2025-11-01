---
"@abimongo/cli": minor
---

Add a new `@abimongo/cli` package that provides an Abimongo-first `init` command (programmatic bootstrap via `AbimongoBootstrap`) and a `scaffold` command that delegates to `@abimongo/create` for interactive scaffolding. The CLI also detects the consumer's package manager and can optionally run install with `--install`.

This change introduces the CLI shim package; it is backwards-compatible and opt-in for programmatic bootstrap.

