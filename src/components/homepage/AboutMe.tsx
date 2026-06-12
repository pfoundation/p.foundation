import React, { FunctionComponent } from 'react';
import clsx from 'clsx';

import styles from './AboutMe.module.scss';

export interface AboutMeProps {
  descriptionComponent: React.ReactNode;
}

interface FoundationValue {
  name: string;
  description: string;
  accent: 'crimson' | 'blue' | 'green' | 'amber';
}

const VALUES: FoundationValue[] = [
  {
    name: 'Patriotism',
    description:
      'Service to the nations we operate in, with benefits felt at the grassroots level.',
    accent: 'crimson',
  },
  {
    name: 'Passion',
    description:
      'An open internet is worth challenging the status quo and breaking down barriers for.',
    accent: 'blue',
  },
  {
    name: 'Persistence',
    description:
      'We stay committed to our goals no matter the hurdles in the way.',
    accent: 'green',
  },
  {
    name: 'Partnership',
    description:
      'Alliances with like-minded entities amplify impact and benefit everyone.',
    accent: 'amber',
  },
];

export const AboutMe: FunctionComponent<AboutMeProps> = ({
  descriptionComponent,
}) => {
  return (
    <section className="pf-section">
      <div className="container">
        <span className="pf-kicker">Who we are</span>
        <h2>About the foundation</h2>
        <div className={styles.columns}>
          <div className={styles.prose}>{descriptionComponent}</div>
          <aside>
            <h3 className={styles.valuesHeading}>Four guiding principles</h3>
            <ul className={styles.values}>
              {VALUES.map((value) => (
                <li
                  key={value.name}
                  className={clsx(styles.value, styles[value.accent])}
                >
                  <span className={styles.valueName}>{value.name}</span>
                  <p className={styles.valueText}>{value.description}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
};
