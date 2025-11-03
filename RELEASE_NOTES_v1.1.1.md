# Release v1.1.1 — abimongo

This release republishes core packages and the CLI with minor/patch bumps.

Packages and highlights

- @abimongo/core — 1.1.1
  - Patch changes: Republish core and logger packages with patch bumps; updated dependency @abimongo/logger@1.1.1

- @abimongo/logger — 1.1.1
  - Patch changes: Republish core and logger packages with patch bumps

- @abimongo/create — 1.0.1
  - Patch changes: Updated dependencies; @abimongo/logger@1.1.1

- @abimongo/cli — 1.1.1
  - Patch changes: Updated dependencies on core/logger/create; CLI made publishable and build wrapper added

Notes

- This release includes CI and docs/tooling fixes to ensure TypeDoc output is sanitized for Docusaurus and changesets runs reliably in CI.
- If you maintain a docs site hosted from this repo, CI will generate the API docs at build time. The repository will stop tracking TypeDoc output files in the tree.

Detailed changelogs are included in each package's CHANGELOG.md in the `packages/` directory.
