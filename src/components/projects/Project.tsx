import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import Image from '@theme/IdealImage';

import DiscoverIcon from './assets/icon-discover.svg';
import XIcon from './assets/icon-x.svg';
import YoutubeIcon from './assets/icon-youtube.svg';
import styles from './Project.module.scss';

export interface ProjectData {
  title: string;
  description: string;
  role?: string;
  url?: string;
  x?: string;
  youtube?: string;
  image: string;
}

export const Project: FunctionComponent<ProjectData> = ({
  title,
  description,
  url,
  x,
  youtube,
  role,
  image,
}) => {
  return (
    <div className={clsx('col col--6', styles.cardContainer)}>
      <div className={clsx('card', styles.card)}>
        <div className={clsx('card__image', styles.image)}>
          <Image img={image} alt={description} title={title} />
          {role && (
            <span className={clsx('badge badge--secondary', styles.role)}>
              {role}
            </span>
          )}
        </div>
        <div className="card__body">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <div className={styles.buttons}>
            {url && (
              <a
                href={url}
                target="_blank"
                className="button button--primary button--outline"
              >
                <span className="button__icon">
                  <DiscoverIcon className={styles.icon} />
                </span>
                Discover
              </a>
            )}
            {x && (
              <a
                href={`https://twitter.com/${x}`}
                target="_blank"
                className="button button--primary button--outline"
              >
                <span className="button__icon">
                  <XIcon className={styles.icon} />
                </span>
                {x}
              </a>
            )}
            {youtube && (
              <a
                href={`https://youtube.com/@${x}`}
                target="_blank"
                className="button button--primary button--outline"
              >
                <span className="button__icon">
                  <YoutubeIcon className={styles.icon} />
                </span>
                {youtube}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
