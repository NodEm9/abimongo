# PR Draft: Add @abimongo/cli shim, docs, and installer improvements

This PR implements the Abimongo-first CLI shim `@abimongo/cli`, adds documentation and migration guidance, hardens installer behavior, and prepares a changeset for release.

Summary of changes

- packages/cli
  - Implemented `init` (programmatic Abimongo-first bootstrap) and `scaffold` (delegates to `@abimongo/create` via spawn).
  - Hardened installer invocation: capture-first, retry with inherited stdio if spawn status is null.
  - Normalize generated `abimongo.config.json` shapes before programmatic bootstrap to avoid runtime shape errors.
  - Updated output: banner is plain (no color) for easier log capture; final bootstrap success/failure messages are colorized for clarity.

- docs/
  - docs/website/tutorials/core_tutotrials/core-tutorials.md updated to document `@abimongo/cli` vs `@abimongo/create` and migration notes.
  - packages/create/README.md: clarified when to use `@abimongo/create` vs `@abimongo/cli`.
  - packages/create/DEPRECATION.md: draft migration/deprecation guidance (text-only).
  - packages/core/README.md: pointer to `@abimongo/cli` added.

- changeset
  - `.changeset/add-cli-package.md` already exists and will be applied during versioning.

Testing & verification

- Build: `pnpm -w build` (done locally; recommend running before merging).
- Tests: `pnpm -w test` (run locally in CI). I attempted to run tests from the agent but could not capture logs; please run locally or in CI to confirm all tests pass.

Notes for reviewers

- The PR intentionally keeps the interactive scaffolder `@abimongo/create` intact and non-deprecated (DEPRECATION.md is a draft). We delegate to it for interactive templating.
- Banner output is intentionally plain to improve log capturing in CI/redirected output. Final bootstrap results are colorized for improved local UX.
- I did not push or open the PR branch since you indicated you do not want to push until features are confirmed working.

How to test locally (recommended)

1. From repo root:

```bash
pnpm -w build
pnpm -w test
```

2. Try the CLI locally (example):

```bash
node ./packages/cli/dist/bin/abimongo_cli.js init test-app
# or interactive scaffold
node ./packages/cli/dist/bin/abimongo_cli.js scaffold
```

If you'd like, I can open this as a draft PR on branch `release/create-prepare` (or a new branch) and attach the changeset; confirm and I'll push/open it.
