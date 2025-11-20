
# Release v1.1.4 — abimongo

This release republishes core packages and the CLI with minor/patch bumps and includes a logger major bump.

Packages and highlights

- @abimongo/core — 1.1.4
  - Patch changes: Republish core package with patch bumps; updated dependency @abimongo/logger@2.0.0

- @abimongo/logger — 2.0.0
  - Major changes: Logger was updated to v2.0.0 (breaking/major changes). Review upgrade notes in the logger CHANGELOG.

- @abimongo/create — 1.0.4
  - Patch changes: Updated dependencies; now depends on @abimongo/logger@2.0.0

- @abimongo/cli — 1.1.4
  - Patch changes: Updated dependencies on core/logger/create; CLI made publishable and build wrapper added

Notes

- This release includes CI and docs/tooling fixes to ensure TypeDoc output is sanitized for Docusaurus and changesets runs reliably in CI.
- If you maintain a docs site hosted from this repo, CI will generate the API docs at build time. The repository will stop tracking TypeDoc output files in the tree.

Detailed changelogs are included in each package's CHANGELOG.md in the `packages/` directory.
