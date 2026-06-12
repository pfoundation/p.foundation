import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './products.module.scss';

interface ProductSummary {
  name: string;
  href: string;
  accent: 'cool' | 'warm' | 'green';
  valueProp: string;
  highlights: string[];
  program: string;
}

const PRODUCTS: ProductSummary[] = [
  {
    name: 'OpenCache',
    href: '/products/opencache',
    accent: 'cool',
    valueProp:
      'A neutral, shared cache layer that serves content from inside local networks, so any provider gets the local delivery the largest platforms built for themselves.',
    highlights: [
      'Identical cache nodes at internet exchanges and inside ISP networks',
      'Open to any content provider, with no CDN of your own required',
      'Hosting a node grants no control: policies stay with the foundation',
    ],
    program: 'Built and operated end to end by the foundation',
  },
  {
    name: 'OpenNRCS',
    href: '/products/opennrcs',
    accent: 'warm',
    valueProp:
      'A full newsroom computer system that carries a story from the wire through a timed rundown to air, web, and social, all in one shared workspace.',
    highlights: [
      'One live feed: AFP, Reuters Connect, RSS, and Google News, with AI triage for open-feed items',
      'One story, three angles: TV script, web article, and social post',
      'Timed rundowns, an assignment desk, and publishing to CMS and social platforms',
    ],
    program: 'Available to MediaGuard partners',
  },
  {
    name: 'Dubbing',
    href: '/products/dubbing',
    accent: 'green',
    valueProp:
      'An AI dubbing studio that takes a finished video in one language to broadcast-ready cuts in other languages, with a human in control of every step.',
    highlights: [
      'Transcript, translation, voices, mix, graphics, and optional lip-sync in one editor',
      'Translations fitted to the clock, with stale tracking so nothing drifts out of sync',
      'Exports to CSV, SRT, WebVTT, and a print-ready PDF, with right-to-left scripts handled',
    ],
    program: 'Available to select MediaGuard partners',
  },
];

const title = 'Products';
const description =
  'Products built and operated by P Foundation: OpenCache, a neutral shared caching network that serves content from inside local networks; OpenNRCS, a full newsroom computer system that carries a story from wire to air to web; and Dubbing, AI dubbing for media content as part of our AI inference support.';

export default function ProductsPage(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <main>
        <section className="pf-section">
          <div className="container">
            <span className="pf-kicker">Products</span>
            <h1>{title}</h1>
            <p className="pf-lede">
              Products born inside our programs, built and operated by the
              foundation, and available to the organizations that need them.
            </p>
            <div className={styles.grid}>
              {PRODUCTS.map((product) => (
                <Link
                  key={product.name}
                  to={product.href}
                  className={clsx('card', styles.card, styles[product.accent])}
                >
                  <h2 className={styles.cardTitle}>{product.name}</h2>
                  <p className={styles.cardValue}>{product.valueProp}</p>
                  <ul className={styles.highlights}>
                    {product.highlights.map((highlight) => (
                      <li key={highlight} className={styles.highlight}>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <p className={styles.program}>{product.program}</p>
                  <span className={styles.more}>
                    Learn more
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
      </main>
    </Layout>
  );
}
