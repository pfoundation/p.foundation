import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import React, { FunctionComponent, useState } from 'react';

import styles from './Newsletter.module.scss';

type SubscribeStatus = 'idle' | 'loading' | 'success' | 'error';

const FALLBACK_ERROR = 'Something went wrong. Please try again.';

export const Newsletter: FunctionComponent = () => {
  const { siteConfig } = useDocusaurusContext();
  const apiBaseUrl = siteConfig.customFields.apiBaseUrl as string;

  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<SubscribeStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Honeypot: humans never see the "company" field. If it has a value,
    // show the success state without calling the API.
    if (company.trim() !== '') {
      setStatus('success');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          referralPage: window.location.pathname + window.location.search,
        }),
      });

      if (response.ok) {
        setStatus('success');
        return;
      }

      let message = FALLBACK_ERROR;
      try {
        const body = await response.json();
        if (body && typeof body.error === 'string' && body.error) {
          message = body.error;
        }
      } catch {
        // Error body was not JSON, keep the fallback message.
      }
      setErrorMessage(message);
      setStatus('error');
    } catch {
      setErrorMessage(FALLBACK_ERROR);
      setStatus('error');
    }
  };

  return (
    <section className={styles.band}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.intro}>
            <span className={clsx('pf-kicker', styles.kicker)}>Newsletter</span>
            <h2 className={styles.heading}>Get updates from the field</h2>
            <p className={styles.lede}>
              Occasional updates on our programs and products. No spam.
            </p>
          </div>

          <div className={styles.action}>
            {status === 'success' ? (
              <div className={styles.success} role="status">
                <svg
                  className={styles.successIcon}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <circle cx="12" cy="12" r="11" fill="var(--pf-green)" />
                  <path
                    d="M7 12.5l3.2 3.2L17 9"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className={styles.successText}>
                  You are on the list. We will be in touch.
                </p>
              </div>
            ) : (
              <>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <label className={styles.srOnly} htmlFor="newsletter-email">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    className={styles.input}
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-describedby={
                      status === 'error' ? 'newsletter-error' : undefined
                    }
                  />
                  <div className={styles.honeypot} aria-hidden="true">
                    <input
                      type="text"
                      name="pf_extra_note"
                      tabIndex={-1}
                      autoComplete="off"
                      value={company}
                      onChange={(event) => setCompany(event.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className={clsx('button', 'important-btn', styles.submit)}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
                {status === 'error' && (
                  <p
                    id="newsletter-error"
                    className={styles.error}
                    role="alert"
                  >
                    {errorMessage}
                  </p>
                )}
                <p className={styles.consent}>
                  By subscribing you agree to receive email updates about P
                  Foundation&apos;s work. Read our{' '}
                  <Link className={styles.consentLink} to="/privacy">
                    privacy policy
                  </Link>
                  .
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
