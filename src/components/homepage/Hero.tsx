import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

import styles from './Hero.module.scss';

export const Hero: FunctionComponent = () => {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className={clsx('hero__title', styles.title)}>
          Empowering nations with{' '}
          <span className={styles.highlighted}>open internet</span> and{' '}
          <span className={styles.highlighted}>free journalism</span>.
        </h1>
        <p className={clsx('hero__subtitle', styles.subtitle)}>
          Bridging the digital divide, the P Foundation is committed to
          connecting communities and fostering a world of informed, global
          collaboration.
        </p>
      </div>
    </header>
  );
};
