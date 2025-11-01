# Finalize CLI release

## Summary

Use this template to finalize the CLI release once tests and CI are green

### Checklist

- [ ] CI (build + typecheck) is green
- [ ] Changeset applied and version bumped
- [ ] NPM dry-run succeeded
- [ ] Release notes drafted and included in PR description
- [ ] Post-publish steps documented (e.g., deprecation notices, docs updates)

### Verification

- [ ] Install package from local tarball to smoke test `abimongo-cli` entrypoint
- [ ] Validate `abimongo-cli --help` and core commands run without throwing

### Notes

Add any final notes about rollout, timing, or coordination with downstream projects.
