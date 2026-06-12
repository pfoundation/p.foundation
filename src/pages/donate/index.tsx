import clsx from 'clsx';
import React, { FunctionComponent, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './donate.module.scss';

type DonationInterval = 'monthly' | 'one_time';

const PRESETS: Record<DonationInterval, number[]> = {
  monthly: [10, 25, 50, 100],
  one_time: [25, 50, 100, 250],
};

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 10000;

function closestPreset(target: number, presets: number[]): number {
  return presets.reduce((best, value) =>
    Math.abs(value - target) < Math.abs(best - target) ? value : best
  );
}

function formatAmount(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

const DonationWidget: FunctionComponent = () => {
  const { siteConfig } = useDocusaurusContext();
  const apiBaseUrl = siteConfig.customFields.apiBaseUrl as string;
  const donateFallbackUrl = siteConfig.customFields.donateFallbackUrl as string;

  const [interval, setDonationInterval] = useState<DonationInterval>('monthly');
  const [preset, setPreset] = useState<number | null>(25);
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const amount = preset ?? (custom.trim() === '' ? NaN : Number(custom));
  const isValid =
    Number.isFinite(amount) && amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;
  const customInvalid = preset === null && custom.trim() !== '' && !isValid;

  const selectInterval = (next: DonationInterval) => {
    if (next === interval) {
      return;
    }
    setDonationInterval(next);
    if (preset !== null && !PRESETS[next].includes(preset)) {
      setPreset(closestPreset(preset, PRESETS[next]));
    }
  };

  const selectPreset = (value: number) => {
    setPreset(value);
    setCustom('');
  };

  const onCustomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustom(event.target.value);
    setPreset(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || loading) {
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`${apiBaseUrl}/api/donate/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          interval,
        }),
      });
      const data = (await response.json()) as { url?: string };
      if (!response.ok || !data.url) {
        throw new Error('Checkout could not be started');
      }
      window.location.assign(data.url);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  const ctaLabel = loading
    ? 'Redirecting to secure checkout...'
    : !isValid
    ? 'Donate'
    : interval === 'monthly'
    ? `Donate $${formatAmount(amount)} monthly`
    : `Donate $${formatAmount(amount)}`;

  return (
    <form className={styles.widget} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.widgetTitle}>Make a donation</h2>

      <div
        className={styles.segment}
        role="group"
        aria-label="Donation frequency"
      >
        <button
          type="button"
          className={clsx(
            styles.segmentBtn,
            interval === 'monthly' && styles.segmentBtnActive
          )}
          aria-pressed={interval === 'monthly'}
          onClick={() => selectInterval('monthly')}
        >
          Give monthly
        </button>
        <button
          type="button"
          className={clsx(
            styles.segmentBtn,
            interval === 'one_time' && styles.segmentBtnActive
          )}
          aria-pressed={interval === 'one_time'}
          onClick={() => selectInterval('one_time')}
        >
          Give once
        </button>
      </div>

      <span className={styles.amountLabel} id="preset-amount-label">
        Amount (USD)
      </span>
      <div
        className={styles.presetGrid}
        role="group"
        aria-labelledby="preset-amount-label"
      >
        {PRESETS[interval].map((value) => (
          <button
            key={value}
            type="button"
            className={clsx(
              styles.presetBtn,
              preset === value && styles.presetBtnActive
            )}
            aria-pressed={preset === value}
            onClick={() => selectPreset(value)}
          >
            ${value}
          </button>
        ))}
      </div>

      <label className={styles.amountLabel} htmlFor="custom-amount">
        Custom amount
      </label>
      <div className={styles.customField}>
        <span className={styles.customPrefix} aria-hidden="true">
          $
        </span>
        <input
          id="custom-amount"
          className={styles.customInput}
          type="number"
          inputMode="decimal"
          min={MIN_AMOUNT}
          max={MAX_AMOUNT}
          step="any"
          placeholder="Other amount"
          value={custom}
          onChange={onCustomChange}
          aria-describedby="custom-amount-hint"
          aria-invalid={customInvalid || undefined}
        />
      </div>
      <p
        id="custom-amount-hint"
        className={clsx(
          styles.amountHint,
          customInvalid && styles.amountHintError
        )}
      >
        Enter an amount between $1 and $10,000.
      </p>

      <button
        type="submit"
        className={styles.donateBtn}
        disabled={!isValid || loading}
      >
        {ctaLabel}
      </button>

      {error && (
        <div className={styles.errorBox} role="alert">
          We could not start the checkout. Try again, or use our{' '}
          <a href={donateFallbackUrl} target="_blank" rel="noopener noreferrer">
            hosted donation page
          </a>
          .
        </div>
      )}

      <p className={styles.trust}>
        Secure checkout by Stripe. Cards, Apple Pay, and Google Pay.
      </p>
      <p className={styles.trust}>
        Cancel or change a monthly gift anytime by emailing{' '}
        <a href="mailto:contact@p.foundation">contact@p.foundation</a>.
      </p>
    </form>
  );
};

const WhatItFunds: FunctionComponent = () => {
  return (
    <div className={styles.fundsCol}>
      <span className="pf-kicker">Where it goes</span>
      <h2>What your donation funds</h2>
      <p className={clsx('pf-lede', styles.fundsLede)}>
        Donations pay for the infrastructure and the people that keep
        information flowing in Lebanon and beyond.
      </p>

      <div className={styles.fundItem}>
        <span
          className={clsx(styles.fundIcon, styles.fundIconBlue)}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.59 13.51 6.83 3.98" />
            <path d="m15.41 6.51-6.82 3.98" />
          </svg>
        </span>
        <div>
          <h3>Community connectivity</h3>
          <p>
            Supports CitizenMesh and ResilientNet, our volunteer-built community
            networks that bring free internet access to schools, libraries, and
            public spaces, and resilient connectivity to healthcare, emergency
            services, and utilities.
          </p>
        </div>
      </div>

      <div className={styles.fundItem}>
        <span
          className={clsx(styles.fundIcon, styles.fundIconGreen)}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="8" rx="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" />
            <line x1="6" y1="18" x2="6.01" y2="18" />
          </svg>
        </span>
        <div>
          <h3>OpenCache</h3>
          <p>
            Builds out servers for OpenCache, our open caching network, so
            popular content is served from inside local networks instead of
            traveling long distances to reach people.
          </p>
        </div>
      </div>

      <div className={styles.fundItem}>
        <span
          className={clsx(styles.fundIcon, styles.fundIconCrimson)}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          </svg>
        </span>
        <div>
          <h3>MediaGuard</h3>
          <p>
            Funds MediaGuard, our program that gives media organizations
            tailored support, from backhaul and streaming to content
            distribution, so independent reporting keeps reaching the public.
          </p>
        </div>
      </div>
    </div>
  );
};

const Faq: FunctionComponent = () => {
  return (
    <section className="pf-section">
      <div className="container">
        <span className="pf-kicker">Questions</span>
        <h2>Donation FAQ</h2>
        <p className="pf-lede">
          Short answers to the questions donors ask most. Anything else, email{' '}
          <a href="mailto:contact@p.foundation">contact@p.foundation</a>.
        </p>

        <div className={styles.faqList}>
          <details className={styles.faqItem}>
            <summary className={styles.faqSummary}>
              Is my donation tax deductible?
              <span className={styles.faqIndicator} aria-hidden="true" />
            </summary>
            <div className={styles.faqBody}>
              <p>
                Yes. P Foundation is a 501(c)(3) nonprofit registered in
                Washington, DC, so donations are tax deductible in the US.
                Stripe emails you a receipt as soon as your donation goes
                through. Keep it for your records.
              </p>
            </div>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqSummary}>
              Can I change or cancel a monthly donation?
              <span className={styles.faqIndicator} aria-hidden="true" />
            </summary>
            <div className={styles.faqBody}>
              <p>
                Yes, anytime. Email{' '}
                <a href="mailto:contact@p.foundation">contact@p.foundation</a>{' '}
                and we will adjust the amount or cancel the gift, no questions
                asked.
              </p>
            </div>
          </details>

          <details className={styles.faqItem}>
            <summary className={styles.faqSummary}>
              Can I give some other way?
              <span className={styles.faqIndicator} aria-hidden="true" />
            </summary>
            <div className={styles.faqBody}>
              <p>
                Yes. For bank transfers and other arrangements, write to{' '}
                <a href="mailto:contact@p.foundation">contact@p.foundation</a>.
                You can also reach us by mail at 700 12th St NW, Washington, DC
                20005.
              </p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};

export default function Donate(): JSX.Element {
  return (
    <Layout
      title="Donate"
      description="Support P Foundation. Your donation funds community connectivity, OpenCache, and tailored support that keeps independent media organizations on the air. P Foundation is a 501(c)(3) nonprofit and donations are tax deductible in the US."
    >
      <header className={styles.hero}>
        <div className={clsx('container', styles.heroInner)}>
          <span className={clsx('pf-kicker', styles.heroKicker)}>
            Support the mission
          </span>
          <h1 className={styles.heroTitle}>Fund an open internet</h1>
          <p className={styles.heroLede}>
            Donations fund our programs and products: community connectivity
            through volunteer-built networks, OpenCache servers that bring
            content closer to people, and tailored support that keeps
            independent media organizations on the air. P Foundation is a
            501(c)(3) nonprofit, so donations are tax deductible in the US.
          </p>
        </div>
      </header>

      <main>
        <section className={styles.overlapSection}>
          <div className="container">
            <div className={styles.layoutGrid}>
              <div className={styles.widgetWrap}>
                <DonationWidget />
              </div>
              <WhatItFunds />
            </div>
          </div>
        </section>

        {/* <Faq /> */}
      </main>
    </Layout>
  );
}
