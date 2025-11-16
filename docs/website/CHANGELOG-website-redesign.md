# Website redesign changelog

Date: 2025-11-16

Summary
-------

- Fix: Restore Tailwind typography (prose) styles for blog posts by enabling the
  @tailwindcss/typography plugin and ensuring blog .md/.mdx files are included in
  Tailwind's content scan.
- Fix: Ensure blog pages include proper spacing/padding and MDX rendering.
- Chore: Silence blog plugin warnings for inline authors and untruncated posts by
  configuring Docusaurus blog plugin options (onInlineAuthors/onUntruncatedBlogPosts set to 'ignore').

Notes
-----

Files changed:

- `tailwind.config.js` — import typography plugin and scan `docs/website/**/*.{md,mdx}`
- `docs/website/docusaurus.config.ts` — set blog plugin options to ignore inline authors and untruncated posts
- `docs/website/src/components/ComingSoon/ComingSoon.tsx` — UX fixes for modal unmount/scroll-lock

How to test
-----------

1. Run the Tailwind build and Docusaurus build:

   pnpm run docs:build

2. Start the dev server and visit /blog and an individual post to confirm
   typography, padding, and MDX content render correctly.

If anything looks off, the next steps are:

- Add canonical entries to `docs/website/authors.yml` and remove the `onInlineAuthors` ignore setting.
- Investigate any remaining CSS warnings (invalid font values) and adjust source CSS.
