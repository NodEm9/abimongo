---
slug: /core/log-changes
title: Core changelog
---

## No releases published yet

We haven't published any releases for the new scoped @abimongo packages yet. This repository is being re-scoped for the first public release and the initial version for the scoped packages will start at v1.0.0.

What this means for the docs:

- There are currently no published changelogs to display for the @abimongo packages.
- Once the scoped packages are released, the changelog generator (changesets/auto-changelog) will create or update `packages/core/CHANGELOG.md` and this script will copy it into the docs.

Next steps for maintainers:

1. Publish the scoped packages under the @abimongo scope starting at v1.0.0.
2. Run the changelog generator (for example: `changeset version` / auto-changelog) to produce `packages/core/CHANGELOG.md`.
3. Run `node ./scripts/copy-changelog.js` (or `npm run docs:changelog`) to update this page.

If you already have a local `packages/core/CHANGELOG.md`, running the copy script will replace this placeholder with the real changelog.

For community updates and the release roadmap, keep an eye on the project's release notes and the announcements channel where we will publish the v1.0.0 launch details.
