import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useColorMode } from '@docusaurus/theme-common';

import styles from './ThemeToggle.module.scss';

const SunIcon: FunctionComponent = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon: FunctionComponent = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const ThemeToggle: FunctionComponent = () => {
  const isBrowser = useIsBrowser();
  const { colorMode, setColorMode } = useColorMode();

  return (
    <div className={styles.wrap}>
      <div className={styles.segment} role="group" aria-label="Color theme">
        <button
          type="button"
          className={clsx(
            styles.option,
            colorMode === 'light' && styles.optionActive
          )}
          aria-pressed={colorMode === 'light'}
          disabled={!isBrowser}
          onClick={() => setColorMode('light')}
        >
          <SunIcon />
          Light
        </button>
        <button
          type="button"
          className={clsx(
            styles.option,
            colorMode === 'dark' && styles.optionActive
          )}
          aria-pressed={colorMode === 'dark'}
          disabled={!isBrowser}
          onClick={() => setColorMode('dark')}
        >
          <MoonIcon />
          Dark
        </button>
      </div>
    </div>
  );
};
