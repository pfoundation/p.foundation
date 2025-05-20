import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import {
  useSidebarBreadcrumbs,
  useHomePageRoute,
} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import HomeBreadcrumbItem from '@theme/DocBreadcrumbs/Items/Home';
import { useLocation } from '@docusaurus/router';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import './styles.css';

// TODO move to theme-common
function useBreadcrumbs() {
  const breadcrumbs = useSidebarBreadcrumbs();
  const homePageRoute = useHomePageRoute();
  const location = useLocation();
  const { withBaseUrl } = useBaseUrlUtils();

  // Only process breadcrumbs if they exist
  if (breadcrumbs) {
    const isOpenIXPath = location.pathname.startsWith('/OpenIX');

    // For OpenIX paths, make sure OpenIX is in the breadcrumbs
    if (isOpenIXPath) {
      const hasOpenIX = breadcrumbs.some(
        (item) =>
          item.href === withBaseUrl('/OpenIX') || item.label === 'OpenIX'
      );

      if (!hasOpenIX) {
        // Create OpenIX breadcrumb
        const openIXBreadcrumb = {
          href: withBaseUrl('/OpenIX'),
          label: 'OpenIX',
        };

        // Return with OpenIX as first item in breadcrumbs
        return [openIXBreadcrumb, ...breadcrumbs];
      }
    }

    // Return original breadcrumbs for non-OpenIX paths or if OpenIX already exists
    return breadcrumbs;
  }

  if (!breadcrumbs) {
    return (
      homePageRoute && [
        {
          href: homePageRoute.path,
          label: translate({
            message: 'Home',
            id: 'theme.docs.breadcrumbs.home',
            description: 'The ARIA label for the home page in the breadcrumbs',
          }),
        },
      ]
    );
  }

  return breadcrumbs;
}

export default function DocBreadcrumbs() {
  const breadcrumbs = useBreadcrumbs();

  if (!breadcrumbs) {
    return null;
  }

  return (
    <nav
      className={clsx(ThemeClassNames.docs.docBreadcrumbs, 'breadcrumbs')}
      aria-label={translate({
        id: 'theme.docs.breadcrumbs.navAriaLabel',
        message: 'Breadcrumbs',
        description: 'The ARIA label for the breadcrumbs',
      })}
    >
      <ul className="breadcrumbs__list">
        <HomeBreadcrumbItem />
        {breadcrumbs.map((item, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <li key={idx} className="breadcrumbs__item">
              {!isLast ? (
                <Link
                  className="breadcrumbs__link"
                  href={item.href}
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span className="breadcrumbs__link" itemProp="name">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
