const fs = require('fs');
const path = require('path');

/**
 * Minimal frontmatter parser for the simple key: value pairs used by the
 * updates posts. Lines that are comments or nested structures are skipped.
 * @param {string} raw
 * @returns {Record<string, string>}
 */
function parseFrontmatter(raw) {
  const data = {};
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return data;
  }
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) {
      data[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return data;
}

/**
 * Exposes the most recent posts from the ./updates blog instance as global
 * data, so landing pages can feature them without importing blog internals.
 */
module.exports = function recentUpdatesPlugin(context) {
  return {
    name: 'recent-updates-plugin',
    async loadContent() {
      const updatesDir = path.join(context.siteDir, 'updates');
      const files = fs
        .readdirSync(updatesDir)
        .filter((file) => /\.mdx?$/.test(file));

      const posts = files
        .map((file) => {
          const raw = fs.readFileSync(path.join(updatesDir, file), 'utf8');
          const frontmatter = parseFrontmatter(raw);
          const fileMatch = file.match(/^(\d{4}-\d{2}-\d{2})-(.*)\.mdx?$/);
          const date = frontmatter.date || (fileMatch ? fileMatch[1] : null);
          // Without a frontmatter slug the blog plugin generates a date based
          // route (/updates/YYYY/MM/DD/name), so the fallback must match it.
          const slug =
            frontmatter.slug ||
            (fileMatch
              ? `${fileMatch[1].replace(/-/g, '/')}/${fileMatch[2]}`
              : file.replace(/\.mdx?$/, ''));
          return {
            title: frontmatter.title || slug,
            description: frontmatter.description || '',
            date,
            permalink: `/updates/${slug.replace(/^\/+/, '')}`,
            // Drafts and unlisted posts are excluded from production builds
            // by the blog plugin, so linking them would 404.
            hidden:
              frontmatter.draft === 'true' || frontmatter.unlisted === 'true',
          };
        })
        .filter((post) => post.date && post.title && !post.hidden)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)
        .map(({ title, description, date, permalink }) => ({
          title,
          description,
          date,
          permalink,
        }));

      return { posts };
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
};
