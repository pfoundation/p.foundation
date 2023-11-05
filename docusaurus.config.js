// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// eslint-disable-next-line @typescript-eslint/no-var-requires
const lightCodeTheme = require('prism-react-renderer/themes/github');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */

const config = {
  title: 'P Foundation',
  tagline: 'Empowering nations through open internet, and free journalism.',
  url: 'https://www.p.foundation',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config
  organizationName: 'pfoundation',
  projectName: 'p.foundation',

  customFields: {
    newsletter: {
      action: 'https://dev.us14.list-manage.com/subscribe/post?u=?',
      method: 'post',
      emailFieldName: 'EMAIL',
      firstNameFieldName: 'FNAME',
      submitButtonName: 'subscribe',
      tosURL: 'https://mailchimp.com/legal/terms/',
      privacyPolicyURL: 'https://www.intuit.com/privacy/statement/',
      serviceName: 'Mailchimp',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
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
        id: 'messages',
        /**
         * URL route for the blog section of your site.
         * *DO NOT* include a trailing slash.
         */
        routeBasePath: 'messages',
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: './messages',
        blogSidebarCount: 0,
        blogTitle: 'P Foundation Messages',
        blogDescription:
          'Messages from the P Foundation to the donors and community.',
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
          changefreq: 'weekly',
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
            'Empowering nations through open internet, and free journalism.',
        },
        {
          name: 'keywords',
          content: 'foundation, nonprofit, pfoundation, lebanon, usa, dc',
        },
        {
          name: 'twitter:card',
          content:
            'Empowering nations through open internet, and free journalism.',
        },
      ],
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
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
          { to: '/initiatives', label: 'Initiatives', position: 'left' },
          // {
          //   type: 'localeDropdown',
          //   position: 'right',
          // },
          {
            href: 'https://x.com/pfoundation_',
            className: 'navbar-item-x',
            position: 'right',
            alt: 'Twitter, now X Logo',
          },
          {
            label: 'Donate',
            position: 'right',
            href: 'https://donate.stripe.com/8wM15masqehlgfu4gh',
            className: 'button--primary important-btn',
          },
          // {
          //   href: 'https://github.com.com/pfoundation',
          //   className: 'navbar-item-github',
          //   position: 'right',
          //   alt: 'Github Logo (Header)',
          // },
        ],
      },
      footer: {
        style: 'light',
        links: [
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
            href: 'mailto:contact@p.foundation',
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
