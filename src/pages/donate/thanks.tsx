import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './donate.module.scss';

export default function DonateThanks(): JSX.Element {
  return (
    <Layout
      title="Thank you"
      description="Your donation to P Foundation was received. Thank you for supporting an open internet and free journalism."
    >
      <main className={styles.thanksSection}>
        <div className="container">
          <div className={styles.thanksWrap}>
            <div className={styles.thanksIcon} aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h1 className={styles.thanksTitle}>Thank you</h1>
            <p className={styles.thanksCopy}>
              Your donation was received. Stripe will email you a receipt for
              your records.
            </p>
            <p className={styles.thanksCopy}>
              If you set up a monthly gift, you can change or cancel it anytime
              by emailing{' '}
              <a href="mailto:contact@p.foundation">contact@p.foundation</a>.
            </p>
            <div className={styles.thanksActions}>
              <Link className="button button--primary button--lg" to="/">
                Back to home
              </Link>
              <Link
                className="button button--outline button--primary button--lg"
                to="/updates"
              >
                Read our updates
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
