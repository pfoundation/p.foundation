import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

import styles from './Programs.module.scss';
import RecordingIcon from './assets/icon-recording.svg';
import SlidesIcon from './assets/icon-slides.svg';
import RepositoryIcon from './assets/icon-repository.svg';
import CalendarIcon from './assets/icon-calendar.svg';
import MessageIcon from './assets/icon-message.svg';
import LocationIcon from './assets/icon-location.svg';

export interface ProgramMetadata {
  title: string;
  description: React.ReactNode;
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

const Program: FunctionComponent<ProgramMetadata> = ({
  title,
  description,
  beneficiaries = [],
  recordingURL,
  slidesURL,
  repoURL,
  applyURL,
}) => {
  return (
    <div className="col col--12">
      <div className={clsx('card', styles.card)}>
        <div className="card__header">
          <h2>{title}</h2>
        </div>
        <div className="card__body">
          <div className="row">
            <div className="col col--7">{description}</div>
            <div className={clsx('col col--5', styles.eventDetailsContainer)}>
              <ProgramDetails data={beneficiaries} />
            </div>
          </div>
        </div>
        <div className="card__footer">
          <div className={styles.buttons}>
            {applyURL && (
              <a
                href={applyURL}
                target="_blank"
                className="button button--primary button--outline"
              >
                <span className="button__icon">
                  <MessageIcon />
                </span>
                Apply
              </a>
            )}
            {recordingURL && (
              <a
                href={recordingURL}
                target="_blank"
                className="button button--primary button--outline"
              >
                <span className="button__icon">
                  <RecordingIcon />
                </span>
                Watch recording
              </a>
            )}
            {slidesURL && (
              <a
                href={slidesURL}
                target="_blank"
                className="button button--secondary button--outline"
              >
                <span className="button__icon">
                  <SlidesIcon />
                </span>
                See slides
              </a>
            )}
            {repoURL && (
              <a
                href={repoURL}
                target="_blank"
                className="button button--secondary button--outline"
              >
                <span className="button__icon">
                  <RepositoryIcon />
                </span>
                See repository
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgramDetails: FunctionComponent<{ data: programBeneficiaries[] }> = ({
  data,
}) => {
  if (data.length === 0) {
    return null;
  }

  const [firstProgram, ...otherPrograms] = data;
  const { name, location, date } = firstProgram;
  return (
    <div className="row">
      <div className="col col--12">
        <ul className={styles.list}>
          <li>
            <MessageIcon className={styles.icon} /> <strong>{name}</strong>
          </li>
          <li>
            <LocationIcon className={styles.icon} /> {location}
          </li>
          <li>
            <CalendarIcon className={styles.icon} /> {date}
          </li>
        </ul>
      </div>
      {data.length > 1 && (
        <div className="col col--12">
          <p className="margin--none">Current public beneficiaries</p>
          <ul>
            {otherPrograms.map(({ name, location, date }) => (
              <li key={name}>
                <strong>{name}</strong> in {location} since {date}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

function formatDateString(date: Date): string {
  return `${date.getMonth() + 1}/${date.getUTCFullYear()}`;
}

export default Program;
