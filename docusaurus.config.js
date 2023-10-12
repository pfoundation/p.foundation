// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// eslint-disable-next-line @typescript-eslint/no-var-requires
const lightCodeTheme = require("prism-react-renderer/themes/github");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */

const config = {
  title: "P Foundation",
  tagline:
    "Software engineer interested in personal growth and tech trends. Cloud-native and open-source enthusiast.",
  url: "https://p.foundation",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config
  organizationName: "pfoundation",
  projectName: "p.foundation",

  customFields: {
    newsletter: {
      action: "https://dev.us14.list-manage.com/subscribe/post?u=?",
      method: "post",
      emailFieldName: "EMAIL",
      firstNameFieldName: "FNAME",
      submitButtonName: "subscribe",
      tosURL: "https://mailchimp.com/legal/terms/",
      privacyPolicyURL: "https://www.intuit.com/privacy/statement/",
      serviceName: "Mailchimp",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en", "ar"],
    localeConfigs: {
      en: {
        htmlLang: "en-US",
      },
      ar: {
        direction: "rtl",
      },
    },
  },
  plugins: [
    "docusaurus-plugin-sass",
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 85,
        max: 2000,
        min: 500,
        steps: 4,
        disableInDev: false,
      },
    ],
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        //blog: {
        //   showReadingTime: true,
        //   editUrl: 'https://github.com/pfoundation/website/tree/main/',
        //   feedOptions: {
        //     type: 'all',
        //     copyright: `Copyright © ${new Date().getFullYear()} P Foundation`,
        //   },
        //},
        theme: {
          customCss: [require.resolve("./src/css/custom.scss")],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/logo-small.png",
      metadata: [
        {
          name: "description",
          content:
            "I am software developer interested in technology and gadgets. Cloud-native and open-source enthusiast.",
        },
        {
          name: "keywords",
          content: "foundation, nonprofit, pfoundation, lebanon, usa, dc",
        },
        {
          name: "twitter:card",
          content: "summary",
        },
      ],
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        hideOnScroll: false,
        title: "P Foundation",
        logo: {
          alt: "P Foundation Logo",
          src: "img/logo.svg",
          srcDark: "img/logo-white.svg",
        },
        items: [
          //{ to: '/blog', label: 'Blog', position: 'left' },
          //{ to: '/projects', label: 'Projects', position: 'left' },
          {
            to: "/programs",
            label: "Programs",
            position: "left",
          },
          { to: "/initiatives", label: "Initiatives", position: "left" },
          {
            type: "localeDropdown",
            position: "right",
          },
          {
            href: "https://x.com/tpfndn",
            className: "navbar-item-x",
            position: "right",
            alt: "Twitter, now X Logo",
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
        style: "light",
        links: [
          {
            label: "Terms",
            to: "/terms",
          },
          {
            label: "Privacy",
            to: "/privacy",
          },
          {
            label: "AS399728",
            to: "/as399728",
          },
          {
            label: "Contact",
            href: "mailto:hello@p.foundation",
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
