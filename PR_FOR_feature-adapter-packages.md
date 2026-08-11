PR Draft: feature/adapter-packages

Summary

This PR updates the `feature/adapter-packages` branch by consolidating a set of refactors, test updates, and tooling changes in the `packages/core` package. The local commit was amended to include these changes so the branch contains a single updated commit.

What changed (grouped)

- Tests
  - Updated/added integration and unit tests under `packages/core/src/__test__` (AbimongoBootstrap, AbimongoClient, AbimongoModel, multi-tenancy tests).
- Core library
  - Refactors and updates to `AbimongoClient`, `AbimongoModelFactory`, `AbimongoSchema`, bootstrap code and tenancy (MultiTenantManager, TenantContext, TenantModelResolver).
- Config
  - Updated `abimongo.config.schema.json` and `loadAbimongoConfig.ts`.
- GraphQL & GC
  - Improvements to `initializeGraphQL.ts` and `AbimongoGC.ts`.
- Types
  - Updated `AbimongoConfig` and related type definitions; added bootstrap/client/result util types.
- Examples & tooling
  - Updated example files and `packages/core/scripts/validate-exports.ts` and other helper scripts in `scripts/`.


