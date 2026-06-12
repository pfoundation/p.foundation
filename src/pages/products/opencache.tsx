import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './productPage.module.scss';

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

const ControlPlaneIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <rect x="8" y="3" width="8" height="5" />
    <rect x="3" y="16" width="6" height="5" />
    <rect x="15" y="16" width="6" height="5" />
    <path d="M12 8v4" />
    <path d="M6 16v-4h12v4" />
  </svg>
);

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

const AlwaysOnIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-2.6-6.4" />
    <path d="M21 3v6h-6" />
  </svg>
);

const ShieldIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <path d="M12 3 5 6v5.2c0 4.3 2.9 7.3 7 8.8 4.1-1.5 7-4.5 7-8.8V6l-7-3Z" />
    <path d="m9 11.6 2.1 2.1 3.9-3.9" />
  </svg>
);

interface Feature {
  title: string;
  body: string;
  iconClass: string;
  icon: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    title: 'Identical nodes, central control',
    body: 'Identical cache nodes carry the data plane at internet exchanges and inside ISP networks. A central control plane, operated by P Foundation, holds configuration, traffic policies, telemetry, and observability for every node.',
    iconClass: styles.iconBlue,
    icon: ControlPlaneIcon,
  },
  {
    title: 'Network-aware nodes',
    body: "Each node holds a BGP session with its host network and works out which prefixes are genuinely local, so it serves the host ISP's subscribers or the networks peering at the exchange. Health-aware steering shifts traffic away from a draining or saturated node before users notice.",
    iconClass: styles.iconGreen,
    icon: NetworkIcon,
  },
  {
    title: 'Always-on behaviors',
    body: 'Request collapsing sends one request to the origin when a popular object expires instead of thousands. Stale serving keeps responses flowing while a node revalidates or an origin errors. Origins fail over with health-aware retries, and every response carries diagnostic headers.',
    iconClass: styles.iconAmber,
    icon: AlwaysOnIcon,
  },
  {
    title: 'Neutrality by architecture',
    body: 'Hosting a node grants no control over it. TLS terminates inside the foundation-operated node, and the same policies are enforced across the whole fleet, so a host network cannot alter or degrade the content its node serves.',
    iconClass: styles.iconCrimson,
    icon: ShieldIcon,
  },
];

const title = 'OpenCache';
const description =
  'OpenCache is an open caching network built and operated by P Foundation. Identical cache nodes at internet exchanges and inside ISP networks serve content from within the local network, so any content provider can deliver locally without building a CDN.';

export default function OpenCachePage(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <header className={styles.hero}>
        <div className={clsx('container', styles.heroInner)}>
          <span className={clsx('pf-kicker', styles.heroKicker)}>Product</span>
          <h1 className={styles.heroTitle}>OpenCache</h1>
          <p className={styles.heroLede}>
            One neutral, shared cache layer that any content provider can use
            and any ISP can host. Nodes at internet exchanges and inside ISP
            networks serve content from within the local network, built and
            operated end to end by P Foundation.
          </p>
          <div className={styles.heroActions}>
            <Link
              className={clsx('button', 'button--lg', 'important-btn')}
              to="/apply/opencache"
            >
              Apply for OpenCache
            </Link>
            <Link
              className={clsx('button', 'button--lg', styles.heroGhostBtn)}
              to="/programs"
            >
              Related program
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="pf-section">
          <div className="container">
            <span className="pf-kicker">The problem</span>
            <h2>Local delivery was reserved for the largest platforms</h2>
            <div className={styles.sectionBody}>
              <p>
                The large platforms localized their own content years ago with
                embedded cache programs: they ship their own appliances into
                networks, and their traffic stays close to the people requesting
                it. Everyone else, broadcasters, news organizations, software
                publishers, and public institutions, has no practical way to do
                the same without building and operating a CDN of their own.
                OpenCache closes that gap with one neutral, shared cache layer
                that any content provider can use and any ISP can host.
              </p>
            </div>
          </div>
        </section>

        <section className={clsx('pf-section', styles.band)}>
          <div className="container">
            <span className="pf-kicker">How it works</span>
            <h2>One shared cache layer, operated end to end</h2>
            <div className={styles.featureGrid}>
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className={clsx('card', styles.feature)}
                >
                  <span
                    className={clsx(styles.featureIcon, feature.iconClass)}
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </span>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureBody}>{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pf-section">
          <div className="container">
            <span className="pf-kicker">Who it is for</span>
            <h2>Open to providers and the networks that host them</h2>
            <div className={styles.audienceGrid}>
              <div className={clsx('card', styles.audience)}>
                <span className={styles.audienceLabel}>Content providers</span>
                <h3 className={styles.audienceTitle}>Any content provider</h3>
                <p className={styles.audienceBody}>
                  Broadcasters, news organizations, software publishers, and
                  public institutions can apply and start serving. There is no
                  requirement to operate your own CDN: you keep your origin and
                  your authority over your content, and OpenCache localizes the
                  delivery.
                </p>
              </div>
              <div className={clsx('card', styles.audience)}>
                <span className={styles.audienceLabel}>Host networks</span>
                <h3 className={styles.audienceTitle}>
                  Any ISP that wants a local node
                </h3>
                <p className={styles.audienceBody}>
                  The ISP provides rack space, power, an uplink, and a BGP
                  session. The foundation provides and remotely operates the
                  node: deployment, configuration, monitoring, and lifecycle are
                  all handled centrally.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className="container">
            <div className={styles.ctaInner}>
              <h2 className={styles.ctaTitle}>Apply for OpenCache</h2>
              <p className={styles.ctaText}>
                Apply as a content provider or request a local node for your
                network, and we will take it from there.
              </p>
              <Link
                className={clsx('button', 'button--lg', 'important-btn')}
                to="/apply/opencache"
              >
                Apply for OpenCache
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
