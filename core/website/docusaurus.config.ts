import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Abimongo Docs',
  tagline: 'Abimongo is a MongoDB ODM for TypeScript and JavaScript',
  favicon: 'img/favicon.ico',
  clientModules: [require.resolve('./src/css/custom.css')],

  // Set the production url of your site here
  url: 'https://nodem9.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/abimongo_core/docs-site/',
  onBrokenAnchors: 'ignore',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'NodEm9', // Usually your GitHub org/user name.
  projectName: 'abimongo_core', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: false,

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'api', 
        path: 'api', 
        routeBasePath: 'api', // The URL path for your API docs (e.g., /abimongo_core/docs-site/api/)
        sidebarPath: require.resolve('./sidebars.ts'), // Optional: A separate sidebar for your API docs
        // If you want editing links for your API docs:
        // editUrl: 'https://github.com/NodEm9/abimongo_core/tree/main/abimongo_core/api/',
      },
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/NodEm9/abimongo_core/tree/main/abimongo_core/',
          // Optional: set to `false` to remove the previous/next navigation links.
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
    
  ],

  themeConfig: { 
    image: 'img/abimongo_logo_main.svg',
    navbar: {
      title: 'AbiMongo',
      logo: {
        alt: 'Abimongo Logo',
        src: 'img/abimongo_logo_main.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/api/', // Correct absolute path relative to baseUrl
          label: 'API',
          position: 'left', // Or 'right', as appropriate
        },
        // { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/NodEm9/abimongo_core',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        // {
        //   title: 'Docs',
        //   items: [
        //     {
        //       label: 'Tutorial',
        //       to: '/docs',
        //     },
        //   ],
        // },
        {
          title: 'Community',
          items: [
            {
              label: 'Issues',
              href: 'https://github.com/NodEm9/abimongo_core/issues',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/emmanuel_15444',
            },
            {
              label: 'X',
              href: 'https://twitter.com/NodEm9',
            },
          ],
        },
        {
          title: 'More',
          items: [
            // {
            //   label: 'Blog',
            //   to: '/blog',
            // },
            {
              label: 'GitHub',
              href: 'https://github.com/NodEm9/abimongo_core',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AbiMongo. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
