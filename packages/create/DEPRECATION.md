# Deprecation / Migration notes (draft)

This file provides guidance for a planned deprecation notice for the `@abimongo/create` package if/when the maintainers decide to deprecate it in favor of `@abimongo/cli`.

- Purpose: `@abimongo/create` is the interactive scaffolder containing project templates. `@abimongo/cli` is a lightweight shim that prefers programmatic initialization (via `initAbimongo`) and delegates to `@abimongo/create` for interactive templates.

- Recommendation: Do not deprecate `@abimongo/create` immediately. Instead, phase migration by:
  1. Announcing `@abimongo/cli` as the recommended Abimongo-first entry point for programmatic initialization and CI-friendly creation.
  2. Keeping `@abimongo/create` as the interactive template engine and documenting the delegation path (`@abimongo/cli scaffold` spawns `@abimongo/create`).
  3. If deprecating in the future, provide a 3-month transition period and an npm deprecation notice that points users to `@abimongo/cli` and documents how to continue using templates directly via `@abimongo/create`.

- Example npm deprecate command (run from a maintainer machine with npm rights):

```bash
npm deprecate @abimongo/create "The interactive scaffolder is being superseded by @abimongo/cli (Abimongo-first). See https://github.com/NodEm9/abimongo for migration instructions."
```

- Release note snippet (for changelog / PR description):

"Introduce `@abimongo/cli` (Abimongo-first CLI shim). `@abimongo/create` continues to provide interactive templates; run `@abimongo/cli scaffold` to use those templates."

---
