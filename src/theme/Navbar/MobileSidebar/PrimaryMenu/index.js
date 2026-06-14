import React from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import NavbarItem from '@theme/NavbarItem';

// Swizzled to restructure the mobile drawer: the nav links stay in a scrolling
// list at the top, while the social icons and the Donate CTA are grouped and
// pinned to the bottom (see .pf-mobile-* rules in custom.scss). Which items are
// "social" vs "CTA" is derived from the classNames already set in
// docusaurus.config.js, so the config stays the single source of truth.
const hasClass = (item, name) =>
  typeof item.className === 'string' &&
  item.className.split(' ').includes(name);

const isSocial = (item) =>
  hasClass(item, 'navbar-item-x') || hasClass(item, 'navbar-item-github');
const isCta = (item) => hasClass(item, 'important-btn');

export default function NavbarMobilePrimaryMenu() {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useThemeConfig().navbar.items;
  const close = () => mobileSidebar.toggle();

  const links = items.filter((item) => !isSocial(item) && !isCta(item));
  const social = items.filter(isSocial);
  const cta = items.filter(isCta);

  const render = (item, i) => (
    <NavbarItem mobile {...item} onClick={close} key={i} />
  );

  return (
    <div className="pf-mobile-menu">
      <ul className="menu__list">{links.map(render)}</ul>
      <div className="pf-mobile-menu__bottom">
        {social.length > 0 && (
          <ul className="menu__list pf-mobile-social">{social.map(render)}</ul>
        )}
        {cta.length > 0 && (
          <ul className="menu__list pf-mobile-cta">{cta.map(render)}</ul>
        )}
      </div>
    </div>
  );
}
