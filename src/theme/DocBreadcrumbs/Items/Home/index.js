import React from 'react';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import IconHome from '@theme/Icon/Home';

export default function HomeBreadcrumbItem() {
  const { withBaseUrl } = useBaseUrlUtils();
  const homeHref = withBaseUrl('/');

  return (
    <li className="breadcrumbs__item breadcrumbs__item--home">
      <Link
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.home',
          message: 'Home page',
          description: 'The ARIA label for the home page in the breadcrumbs',
        })}
        className="breadcrumbs__link"
        href={homeHref}
      >
        <IconHome className="home-icon" />
      </Link>
    </li>
  );
}
