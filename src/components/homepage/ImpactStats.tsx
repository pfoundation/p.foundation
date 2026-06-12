import React, { FunctionComponent } from 'react';
import clsx from 'clsx';

import styles from './ImpactStats.module.scss';

interface Stat {
  value: string;
  label: string;
  accent: 'blue' | 'crimson' | 'green' | 'amber';
}

const STATS: Stat[] = [
  {
    value: '2021',
    label: 'Year the foundation was established',
    accent: 'blue',
  },
  {
    value: '501(c)(3)',
    label: 'Nonprofit registered in Washington, DC',
    accent: 'crimson',
  },
  {
    value: '3',
    label: 'Active programs',
    accent: 'green',
  },
  {
    value: '3',
    label: 'Products built and operated by the foundation',
    accent: 'amber',
  },
];

export const ImpactStats: FunctionComponent = () => {
  return (
    <section className={clsx('pf-section', styles.section)}>
      <div className="container">
        <ul className={styles.grid}>
          {STATS.map((stat) => (
            <li
              key={stat.label}
              className={clsx(styles.stat, styles[stat.accent])}
            >
              <span className={styles.tick} aria-hidden="true" />
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
