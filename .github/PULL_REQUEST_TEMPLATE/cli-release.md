# Release PR: CLI package

### Summary

Provide a short summary of what this PR changes and why the CLI package is added/updated.

### Changes

- Added/updated `@abimongo/cli` package (non-invasive shim that exposes `init` and `scaffold`).

### Testing

- [ ] Run `pnpm run build:ordered` locally — ensure packages build successfully.
- [ ] Run `pnpm -w -r exec tsc --build` — workspace typecheck passes.
- [ ] Run CLI smoke tests (if present) or `node packages/cli/dist/bin/abimongo_cli.js --help`.

### Migration notes

- Document how consumers migrate from `@abimongo/create` to `@abimongo/cli` if applicable. Mention that programmatic bootstrap is opt-in via `--bootstrap`.

### Release checklist

- [ ] Changeset present and correct.
- [ ] Version bumped via changeset.
- [ ] CI green (build + typecheck).
- [ ] npm package validated via dry-run.

### Additional notes

Add any roll-out, deprecation, or downstream impacts here.
