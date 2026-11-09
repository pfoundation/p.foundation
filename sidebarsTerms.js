/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  termsSidebar: [
    { type: 'doc', id: 'index', label: 'Overview' },
    {
      type: 'category',
      label: 'Service Agreements',
      collapsible: false,
      items: ['msa', 'opencache', 'sla'],
    },
    {
      type: 'category',
      label: 'Privacy',
      collapsible: false,
      items: ['privacy', 'subprocessors'],
    },
  ],
};
module.exports = sidebars;
