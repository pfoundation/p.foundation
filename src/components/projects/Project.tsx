import clsx from 'clsx';
import React, { FunctionComponent, ReactNode } from 'react';

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
}

const tileVariants = [
  styles.tileWarm,
  styles.tileCool,
  styles.tileDusk,
  styles.tileEmber,
];

function getInitials(title: string): string {
  const trimmed = title.trim();
  // Short all-caps names (like PTUN) read better in full.
  if (/^[A-Z0-9]{2,4}$/.test(trimmed)) {
    return trimmed;
  }
  const words = trimmed.includes(' ')
    ? trimmed.split(/\s+/)
    : trimmed.split(/(?=[A-Z])/);
  return words
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

export const ProjectGrid: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => <div className={styles.grid}>{children}</div>;

export const Project: FunctionComponent<ProjectData & { index?: number }> = ({
  title,
  description,
  url,
  x,
  youtube,
  role,
  index = 0,
}) => {
  const hasLinks = Boolean(url || x || youtube);

  return (
    <article className={clsx('card', styles.card)}>
      <div
        className={clsx(styles.tile, tileVariants[index % tileVariants.length])}
      >
        <span className={styles.initials} aria-hidden="true">
          {getInitials(title)}
        </span>
        {role && (
          <span
            className={clsx(
              styles.badge,
              role === 'Queued' ? styles.badgeQueued : styles.badgeActive
            )}
          >
            {role}
          </span>
        )}
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : (
          <p className={styles.comingSoon}>Details coming soon.</p>
        )}
      </div>
      {hasLinks && (
        <div className={styles.footer}>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--primary button--outline"
            >
              <span className="button__icon">
                <DiscoverIcon className={styles.icon} aria-hidden="true" />
              </span>
              Discover
            </a>
          )}
          {x && (
            <a
              href={`https://twitter.com/${x}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--primary button--outline"
            >
              <span className="button__icon">
                <XIcon className={styles.icon} aria-hidden="true" />
              </span>
              {x}
            </a>
          )}
          {youtube && (
            <a
              href={`https://youtube.com/@${youtube}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--primary button--outline"
            >
              <span className="button__icon">
                <YoutubeIcon className={styles.icon} aria-hidden="true" />
              </span>
              {youtube}
            </a>
          )}
        </div>
      )}
    </article>
  );
};
