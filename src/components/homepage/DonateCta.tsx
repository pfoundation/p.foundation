import React, { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

import styles from './DonateCta.module.scss';

export const DonateCta: FunctionComponent = () => {
  return (
    <section className={styles.cta}>
      <div className="container">
        <div className={styles.inner}>
          <h2 className={styles.title}>Support Our Infrastructure</h2>
          <p className={styles.text}>
            The P Foundation is a 501(c)(3) nonprofit registered in Washington,
            DC. Your donation is tax deductible in the United States.
          </p>
          <Link
            className={clsx('button', 'button--lg', 'important-btn')}
            to="/donate"
          >
            Donate now
          </Link>
        </div>
      </div>
    </section>
  );
};
