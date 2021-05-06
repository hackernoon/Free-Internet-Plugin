/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'The Free Internet Plugin!',
  tagline: 'Because Fuck Paywalls',
  url: 'http://freeinternetplugin.com/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/icon16.png',
  organizationName: 'HackerNoon', // Usually your GitHub org/user name.
  projectName: 'Free Internet Plugin', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Free Internet Plugin',
      logo: {
        alt: 'My Site Logo',
        src: 'img/icon128.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Tutorial',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/hackernoon/Free-Internet-Plugin',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/guytorbet',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/hackernoon/Free-Internet-Plugin',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} HackerNoon`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/hackernoon/Free-Internet-Plugin/edit/master/site/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/hackernoon/Free-Internet-Plugin/edit/master/site/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
