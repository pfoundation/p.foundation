import React, { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';

import styles from './LatestUpdates.module.scss';

interface UpdatePost {
  title: string;
  description: string;
  date: string;
  permalink: string;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export const LatestUpdates: FunctionComponent = () => {
  const { posts } = usePluginData('recent-updates-plugin') as {
    posts: UpdatePost[];
  };

  if (!posts?.length) {
    return null;
  }

  return (
    <section className="pf-section">
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className="pf-kicker">From the field</span>
            <h2 className={styles.heading}>Latest updates</h2>
          </div>
          <Link className={styles.allLink} to="/updates">
            All updates
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
          </Link>
        </div>
        <div className={styles.grid}>
          {posts.map((post) => (
            <Link
              key={post.permalink}
              to={post.permalink}
              className={clsx('card', styles.card)}
            >
              <time className={styles.date} dateTime={post.date}>
                {dateFormatter.format(new Date(post.date))}
              </time>
              <h3 className={styles.cardTitle}>{post.title}</h3>
              {post.description ? (
                <p className={styles.cardBody}>{post.description}</p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
