import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import Link from '@docusaurus/Link';

import styles from './Programs.module.scss';
import RecordingIcon from './assets/icon-recording.svg';
import SlidesIcon from './assets/icon-slides.svg';
import RepositoryIcon from './assets/icon-repository.svg';
import CalendarIcon from './assets/icon-calendar.svg';
import MessageIcon from './assets/icon-message.svg';
import LocationIcon from './assets/icon-location.svg';

export interface RelatedProduct {
  name: string;
  to: string;
  note: string;
}

export interface ProgramMetadata {
  title: string;
  description: React.ReactNode;
  provides?: string[];
  relatedProducts?: RelatedProduct[];
  beneficiaries: programBeneficiaries[];
  recordingURL?: string;
  applyURL?: string;
  slidesURL?: string;
  repoURL?: string;
}

export interface programBeneficiaries {
  name: string;
  location: string;
  date: string;
}

export const Program: FunctionComponent<ProgramMetadata> = ({
  title,
  description,
  provides = [],
  relatedProducts = [],
  beneficiaries = [],
  recordingURL,
  slidesURL,
  repoURL,
  applyURL,
}) => {
  const [primaryContact, ...otherBeneficiaries] = beneficiaries;
  const hasFooter = Boolean(applyURL || recordingURL || slidesURL || repoURL);

  return (
    <article className={clsx('card', styles.card)}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {applyURL && (
          <span className={styles.openBadge}>Accepting applications</span>
        )}
      </div>

      <div className={styles.description}>{description}</div>

      {provides.length > 0 && (
        <div className={styles.provides}>
          <p className={styles.providesLabel}>What we provide</p>
          <ul className={styles.providesList}>
            {provides.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {primaryContact && (
        <ul className={styles.meta}>
          <li>
            <MessageIcon className={styles.metaIcon} aria-hidden="true" />
            <strong>{primaryContact.name}</strong>
          </li>
          <li>
            <LocationIcon className={styles.metaIcon} aria-hidden="true" />
            {primaryContact.location}
          </li>
          <li>
            <CalendarIcon className={styles.metaIcon} aria-hidden="true" />
            {primaryContact.date}
          </li>
        </ul>
      )}

      {otherBeneficiaries.length > 0 && (
        <div className={styles.beneficiaries}>
          <p>Current public beneficiaries</p>
          <ul>
            {otherBeneficiaries.map(({ name, location, date }) => (
              <li key={name}>
                <strong>{name}</strong> in {location} since {date}
              </li>
            ))}
          </ul>
        </div>
      )}

      {relatedProducts.length > 0 && (
        <div className={styles.related}>
          <span className={styles.relatedLabel}>
            {relatedProducts.length > 1
              ? 'Related products'
              : 'Related product'}
          </span>
          <ul className={styles.relatedList}>
            {relatedProducts.map((product) => (
              <li key={product.to} className={styles.relatedItem}>
                <Link to={product.to} className={styles.relatedLink}>
                  {product.name}
                </Link>
                <span className={styles.relatedNote}>{product.note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasFooter && (
        <div className={styles.footer}>
          {applyURL && (
            <Link
              to={applyURL}
              className={clsx('important-btn', styles.applyButton)}
            >
              <MessageIcon aria-hidden="true" />
              Apply now
            </Link>
          )}
          {recordingURL && (
            <a
              href={recordingURL}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--primary button--outline"
            >
              <span className="button__icon">
                <RecordingIcon aria-hidden="true" />
              </span>
              Watch recording
            </a>
          )}
          {slidesURL && (
            <a
              href={slidesURL}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--primary button--outline"
            >
              <span className="button__icon">
                <SlidesIcon aria-hidden="true" />
              </span>
              See slides
            </a>
          )}
          {repoURL && (
            <a
              href={repoURL}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--primary button--outline"
            >
              <span className="button__icon">
                <RepositoryIcon aria-hidden="true" />
              </span>
              See repository
            </a>
          )}
        </div>
      )}
    </article>
  );
};
