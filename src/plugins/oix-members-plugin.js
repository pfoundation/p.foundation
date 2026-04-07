module.exports = function oixMembersPlugin() {
  return {
    name: 'oix-members-plugin',
    async loadContent() {
      const response = await fetch(
        'https://baas.p.foundation/oix/v1/member-export/ixf/1.0?ignore_missing_ixfid=1'
      );
      return response.json();
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
};
