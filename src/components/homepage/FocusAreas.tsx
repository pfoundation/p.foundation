import React, { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

import styles from './FocusAreas.module.scss';

interface FocusArea {
  title: string;
  description: string;
  href: string;
  accent: 'blue' | 'crimson' | 'green';
  icon: React.ReactNode;
}

const iconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const NetworkIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <circle cx="12" cy="5" r="2.2" />
    <circle cx="5" cy="18.5" r="2.2" />
    <circle cx="19" cy="18.5" r="2.2" />
    <path d="M10.9 7 6.1 16.6" />
    <path d="m13.1 7 4.8 9.6" />
    <path d="M7.2 18.5h9.6" />
  </svg>
);

const PressIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <path d="M4 4.5h13V18a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2V4.5Z" />
    <path d="M17 8.5h3V18a2 2 0 0 1-2 2" />
    <path d="M7.5 8.5h6" />
    <path d="M7.5 12h6" />
    <path d="M7.5 15.5h4" />
  </svg>
);

const CommunityIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19.5c.6-3.1 2.8-5 5.5-5s4.9 1.9 5.5 5" />
    <circle cx="17" cy="9.5" r="2.3" />
    <path d="M16.5 14.7c2.1.4 3.6 2 4 4.3" />
  </svg>
);

const AREAS: FocusArea[] = [
  {
    title: 'Free journalism',
    description:
      'Through the MediaGuard program and the OpenNRCS product, we give media organizations the support they need to keep a steady presence and report freely.',
    href: '/programs',
    accent: 'crimson',
    icon: PressIcon,
  },
  {
    title: 'Connected communities',
    description:
      'CitizenMesh helps communities in Lebanon build their own internet, with free access for schools, libraries, and public spaces. ResilientNet extends that work to critical installations like healthcare and emergency services.',
    href: '/programs',
    accent: 'green',
    icon: CommunityIcon,
  },
  {
    title: 'Open infrastructure',
    description:
      'OpenCache is a neutral shared caching network operated by the foundation, serving popular content from inside local networks.',
    href: '/products',
    accent: 'blue',
    icon: NetworkIcon,
  },
];

export const FocusAreas: FunctionComponent = () => {
  return (
    <section className="pf-section">
      <div className="container">
        <span className="pf-kicker">What we do</span>
        <h2>Building open infrastructure and a free press</h2>
        <p className="pf-lede">
          Our programs and products run where the need is concrete: on real
          networks, with real journalists and communities, in Lebanon and across
          the Middle East.
        </p>
        <div className={styles.grid}>
          {AREAS.map((area) => (
            <Link
              key={area.title}
              to={area.href}
              className={clsx('card', styles.card, styles[area.accent])}
            >
              <span className={styles.iconBox} aria-hidden="true">
                {area.icon}
              </span>
              <h3 className={styles.cardTitle}>{area.title}</h3>
              <p className={styles.cardBody}>{area.description}</p>
              <span className={styles.more}>
                Learn more
                <svg
                  {...iconProps}
                  width={16}
                  height={16}
                  role="img"
                  aria-hidden="true"
                >
                  <path d="M4 12h15" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
