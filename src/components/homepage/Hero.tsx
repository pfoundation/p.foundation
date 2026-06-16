import React, { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

import styles from './Hero.module.scss';

export const Hero: FunctionComponent = () => {
  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.inner}>
          <span className={clsx('pf-kicker', styles.kicker)}></span>
          <h1 className={styles.title}>
            Empowering nations with{' '}
            <span className="pf-text-gradient-warm">open internet</span> and{' '}
            <span className="pf-text-gradient-cool">free journalism</span>.
          </h1>
          <p className={styles.lede}>
            Through programs, products, and grassroots initiatives, the P
            Foundation builds open infrastructure and defends the free flow of
            information in Lebanon and across the Middle East.
          </p>
          <div className={styles.actions}>
            <Link
              className={clsx('button', 'button--lg', styles.ghostBtn)}
              to="/programs"
            >
              Explore our programs
            </Link>
            <Link
              className={clsx('button', 'button--lg', 'important-btn')}
              to="/donate"
            >
              Support our work
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
