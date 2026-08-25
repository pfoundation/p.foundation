// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */

// Used both for the `baseUrl` option and to build the icon/manifest hrefs in
// `headTags` below, which Docusaurus emits verbatim (unlike `favicon`, it does
// not prefix them for us).
const baseUrl = '/';

const config = {
  title: 'P Foundation',
  tagline: 'Empowering nations with open internet and free journalism.',
  url: 'https://p.foundation',
  baseUrl,
  trailingSlash: false,
  onBrokenLinks: 'warn',
  // Kept at the site root: browsers and crawlers request /favicon.ico even
  // when nothing declares it. static/img/favicon.ico is the same file, left in
  // place so the previously indexed URL keeps resolving.
  favicon: 'favicon.ico',

  // Markdown configuration
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // GitHub pages deployment config
  organizationName: 'pfoundation',
  projectName: 'p.foundation',

  customFields: {
    // Cloudflare Worker that backs donations, the mailing list, and
    // application forms. Lives on the webapi.p.foundation custom domain;
    // override with PF_API_BASE_URL at build time if it ever moves.
    apiBaseUrl: (
      process.env.PF_API_BASE_URL || 'https://webapi.p.foundation'
    ).replace(/\/+$/, ''),
    // Stripe-hosted donation page, used as a fallback when the API is
    // unreachable.
    donateFallbackUrl: 'https://donate.stripe.com/8wM15masqehlgfu4gh',
  },

  headTags: [
    // Favicons. `favicon` above only emits the .ico; these add the scalable
    // and PNG variants. Google Search wants a square icon that is a multiple
    // of 48px, which the 48/96 PNGs (and the .ico's 48x48 frame) provide.
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: `${baseUrl}img/favicon.svg`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: `${baseUrl}img/favicon-96x96.png`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        href: `${baseUrl}img/favicon-48x48.png`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: `${baseUrl}img/favicon-32x32.png`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: `${baseUrl}img/favicon-16x16.png`,
      },
    },
    // Home-screen icon and label on iOS / iPadOS.
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: `${baseUrl}img/apple-touch-icon.png`,
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'apple-mobile-web-app-title',
        content: 'P Foundation',
      },
    },
    // Android/Chrome install metadata: name, colors and the 192/512 icons.
    {
      tagName: 'link',
      attributes: {
        rel: 'manifest',
        href: `${baseUrl}manifest.json`,
      },
    },
    // Matches --pf-bg in the dark theme, which is the default color mode
    // (themeConfig.colorMode below sets dark and ignores prefers-color-scheme).
    {
      tagName: 'meta',
      attributes: {
        name: 'theme-color',
        content: '#0f0c16',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
  ],

  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap',
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: {
        htmlLang: 'en-US',
      },
      ar: {
        direction: 'rtl',
      },
    },
  },
  plugins: [
    'docusaurus-plugin-sass',
    require.resolve('./src/plugins/oix-members-plugin'),
    require.resolve('./src/plugins/recent-updates-plugin'),
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 85,
        max: 2000,
        min: 500,
        steps: 4,
        disableInDev: false,
      },
    ],
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-TPGR86P8FH',
        anonymizeIP: false,
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        /**
         * Required for any multi-instance plugin
         */
        id: 'updates',
        /**
         * URL route for the blog section of your site.
         * *DO NOT* include a trailing slash.
         */
        routeBasePath: 'updates',
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: './updates',
        blogSidebarCount: 0,
        blogTitle: 'P Foundation Updates',
        blogDescription:
          'Updates from the P Foundation to the donors and community.',
        showLastUpdateTime: true,
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: 'https://pfoundation.maps.arcgis.com/apps/instant/basic/index.html?appid=c96d564f47cd44ca8c6b8118e4338d29',
            from: '/s/southBeirutMap',
          },
          {
            to: '/updates/IntroducingOpenIXBeirut',
            from: '/messages/Introducing_EdgeIXBeirut',
          },
          {
            from: '/calendarbooking/jud',
            to: 'https://calendar.app.google/UrCGibVPmTqTtjGcA',
          },
          {
            from: '/nrcs',
            to: '/opennrcs',
          },
          {
            from: '/aidubbing',
            to: '/dubbing',
          },
          // The ISP application became the Embedded OpenCache PoP page.
          {
            from: '/apply/opencache/isp',
            to: '/opencacheEmbedded',
          },
          // Product pages moved from /products/<name> to /<name>.
          {
            from: '/products/opencache',
            to: '/opencache',
          },
          {
            from: '/products/opennrcs',
            to: '/opennrcs',
          },
          {
            from: '/products/dubbing',
            to: '/dubbing',
          },
          {
            from: '/products/hms',
            to: '/hms',
          },
        ],
        // Add per-page legacy aliases: /messages/* -> /updates/*
        /**
         * Map generated /updates routes (with or without locale prefix) to legacy /messages routes.
         * Examples:
         *  - /updates/slug            -> /messages/slug
         *  - /ar/updates/slug         -> /ar/messages/slug
         *  - /updates                 -> /messages
         *  - /ar/updates              -> /ar/messages
         * @param {string} existingPath
         * @returns {string[]|undefined}
         */
        createRedirects(existingPath) {
          if (existingPath.includes('/updates')) {
            return [existingPath.replace('/updates', '/messages')];
          }
          return undefined;
        },
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'openix',
        path: 'OpenIX',
        routeBasePath: 'OpenIX',
        sidebarCollapsed: false,
        sidebarCollapsible: true,
      },
    ],
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        // blog: {
        //   routeBasePath: '/',
        //   showReadingTime: true,
        //   editUrl: 'https://github.com/pfoundation/p.foundation/tree/master/',
        //   feedOptions: {
        //     type: 'all',
        //     copyright: `Copyright © ${new Date().getFullYear()} P Foundation`,
        //   },
        // },
        theme: {
          customCss: [require.resolve('./src/css/custom.scss')],
        },
        sitemap: {
          changefreq: 'daily',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/logo.png',
      metadata: [
        {
          name: 'description',
          content:
            'Empowering nations through open internet and free journalism.',
        },
        {
          name: 'keywords',
          content: 'foundation, nonprofit, pfoundation, lebanon, usa, dc',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:description',
          content:
            'Empowering nations through open internet and free journalism.',
        },
      ],
      colorMode: {
        defaultMode: 'light',
        // The switch itself lives in the footer (src/components/ThemeToggle);
        // the navbar slot is emptied in src/theme/Navbar/ColorModeToggle.
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        hideOnScroll: false,
        //title: 'P Foundation',
        logo: {
          alt: 'P Foundation',
          src: 'img/logo.svg',
          srcDark: 'img/logoDark.svg',
        },
        items: [
          //{ to: '/blog', label: 'Blog', position: 'left' },
          //{ to: '/projects', label: 'Projects', position: 'left' },
          {
            to: '/programs',
            label: 'Programs',
            position: 'left',
          },
          { to: '/products', label: 'Products', position: 'left' },
          { to: '/OpenIX', label: 'OpenIX', position: 'left' },
          { to: '/updates', label: 'Updates', position: 'right' },
          // {
          //   type: 'localeDropdown',
          //   position: 'right',
          // },
          {
            href: 'https://x.com/pfoundation',
            className: 'navbar-item-x',
            position: 'right',
            'aria-label': 'P Foundation on X',
          },
          {
            label: 'Donate',
            position: 'right',
            to: '/donate',
            className: 'button--primary important-btn',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            label: 'Initiatives',
            to: '/initiatives',
          },
          {
            label: 'Privacy Policy',
            to: '/privacy',
          },
          {
            label: 'Code of Conduct',
            to: '/coc',
          },
          {
            label: 'AS399728',
            to: '/as399728',
          },
          {
            label: 'Contact',
            to: '/contact',
          },
          // {
          //   label: 'PFS',
          //   to: '/pfs',
          // },
        ],
        copyright: `<p class='footer--address'>700 12th St NW, Washington, DC 20005</p> <p class='footer--copyright'>© ${new Date().getFullYear()} P Foundation, some rights reserved.</p>`,
      },
      // algolia: {
      //   appId: '5DLGGOZ8KA',
      //   apiKey: '67ab853aa6285e51112a649d3cb51928',
      //   indexName: 'kosiec',
      // },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
