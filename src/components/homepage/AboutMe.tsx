import React, { FunctionComponent } from 'react';
import clsx from 'clsx';
import Image from '@theme/IdealImage';
import styles from './AboutMe.module.scss';

export interface AboutMeProps {
  avatar?: string;
  descriptionComponent: React.ReactNode;
}

export const AboutMe: FunctionComponent<AboutMeProps> = ({
  avatar,
  descriptionComponent,
}) => {
  return (
    <div className="margin-top--lg">
      <h2>About us</h2>
      <div className="row">
        <div className="col col--9">{descriptionComponent}</div>
        <div className={clsx('col col--2', styles.avatarContainer)}>
          <div className={styles.avatar}></div>
        </div>
      </div>
    </div>
  );
};
