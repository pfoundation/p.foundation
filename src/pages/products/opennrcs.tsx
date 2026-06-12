import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './productPage.module.scss';

const iconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const FeedIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <path d="M4 11a9 9 0 0 1 9 9" />
    <path d="M4 4a16 16 0 0 1 16 16" />
    <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const AnglesIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <path d="m12 3.5 8.5 4.7L12 12.9 3.5 8.2 12 3.5Z" />
    <path d="m3.5 12.6 8.5 4.7 8.5-4.7" />
    <path d="m3.5 16.8 8.5 4.7 8.5-4.7" />
  </svg>
);

const RundownIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2.5" />
  </svg>
);

const AiIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <path d="M12 3.5 13.8 9 19.5 11 13.8 13 12 18.5 10.2 13 4.5 11 10.2 9 12 3.5Z" />
    <path d="M19 16v5" />
    <path d="M16.5 18.5h5" />
  </svg>
);

const DeskIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <rect x="3.5" y="4" width="5" height="16" />
    <rect x="9.75" y="4" width="5" height="10" />
    <rect x="16" y="4" width="5" height="13" />
  </svg>
);

interface Feature {
  title: string;
  body: string;
  iconClass: string;
  icon: React.ReactNode;
  wide?: boolean;
}

const FEATURES: Feature[] = [
  {
    title: 'The feed',
    body: 'AFP, Reuters Connect, RSS, and Google News arrive in one live stream. AI triage assigns flash, urgent, or normal priority to open-feed items, while agency wire priorities carry straight through. Media is preserved in the project library, and agency updates stay attached to the original item instead of piling up as duplicates.',
    iconClass: styles.iconBlue,
    icon: FeedIcon,
  },
  {
    title: 'One story, three angles',
    body: 'A story is written once and angled three ways: a TV script, a web article, and a social post. The script is built from typed blocks and times itself at about 150 words per minute, and the whole editor is RTL-aware for Arabic.',
    iconClass: styles.iconCrimson,
    icon: AnglesIcon,
  },
  {
    title: 'The rundown',
    body: 'Lettered segments hold story rows against live timing columns. Readiness chips show script, media, CG, and timing state at a glance, live mode turns the grid into the on-air surface, and templates spawn a standing show structure in one step.',
    iconClass: styles.iconGreen,
    icon: RundownIcon,
  },
  {
    title: 'AI the newsroom steers',
    body: 'Three prompts owned by the newsroom set the editorial direction, the anchor-read style, and the voice-over style. Drafts come at three depths, and the web article and social post can be regenerated from the current script at any time.',
    iconClass: styles.iconAmber,
    icon: AiIcon,
  },
  {
    title: 'Assignment desk and publishing',
    body: 'A kanban board carries assignments from pitch to published, with story status and desk stage moving together. An SEO editor and per-platform previews publish to CMS and social targets: WordPress, Arc XP, YouTube, Facebook, Instagram, and X.',
    iconClass: styles.iconSlate,
    icon: DeskIcon,
    wide: true,
  },
];

const title = 'OpenNRCS';
const description =
  'OpenNRCS is a full newsroom computer system built by P Foundation and available to the MediaGuard program partners. One shared workspace carries a story from the wire through writing, review, and a timed rundown to air, and out to the web and social platforms.';

export default function OpenNrcsPage(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <header className={styles.hero}>
        <div className={clsx('container', styles.heroInner)}>
          <span className={clsx('pf-kicker', styles.heroKicker)}>Product</span>
          <h1 className={styles.heroTitle}>OpenNRCS</h1>
          <p className={styles.heroLede}>
            OpenNRCS is a full newsroom computer system. It carries a story
            across its entire life: from the wire, through writing and review,
            into a timed rundown, on air, and out to the web and social
            platforms, all in one shared workspace.
          </p>
          <p className={styles.heroAvailability}>
            Available to MediaGuard partners
          </p>
          <div className={styles.heroActions}>
            <Link
              className={clsx('button', 'button--lg', 'important-btn')}
              to="/apply?program=mediaguard"
            >
              Apply through MediaGuard
            </Link>
            <Link
              className={clsx('button', 'button--lg', styles.heroGhostBtn)}
              to="/programs"
            >
              Related program
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="pf-section">
          <div className="container">
            <span className="pf-kicker">The problem</span>
            <h2>One story, five disconnected systems</h2>
            <div className={styles.sectionBody}>
              <p>
                Newsroom tooling has traditionally been split across systems: a
                wire terminal, a script editor, a rundown application, a web
                CMS, a social scheduler. Every handoff between them loses
                context. OpenNRCS folds that chain into a single surface where
                the source material, the broadcast script, the show clock, and
                the published article are all views of the same story.
              </p>
            </div>
          </div>
        </section>

        <section className={clsx('pf-section', styles.band)}>
          <div className="container">
            <span className="pf-kicker">How it works</span>
            <h2>One workspace from wire to air</h2>
            <div className={styles.featureGrid}>
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className={clsx(
                    'card',
                    styles.feature,
                    feature.wide && styles.featureWide
                  )}
                >
                  <span
                    className={clsx(styles.featureIcon, feature.iconClass)}
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </span>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureBody}>{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pf-section">
          <div className="container">
            <span className="pf-kicker">Who it is for</span>
            <h2>Built for desks that publish everywhere</h2>
            <div className={styles.audienceGrid}>
              <div className={clsx('card', styles.audience)}>
                <span className={styles.audienceLabel}>Broadcast</span>
                <h3 className={styles.audienceTitle}>Broadcast newsrooms</h3>
                <p className={styles.audienceBody}>
                  Producers, reporters, and editors who put a daily show on air
                  share one workspace: the feed, the scripts, the rundown clock,
                  and the assignment desk all point at the same stories.
                </p>
              </div>
              <div className={clsx('card', styles.audience)}>
                <span className={styles.audienceLabel}>Converged</span>
                <h3 className={styles.audienceTitle}>Converged desks</h3>
                <p className={styles.audienceBody}>
                  Desks that produce TV, web, and social from one team write the
                  story once, angle it three ways, and publish each angle to its
                  destination without leaving the workspace.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className="container">
            <div className={styles.ctaInner}>
              <h2 className={styles.ctaTitle}>Apply through MediaGuard</h2>
              <p className={styles.ctaText}>
                OpenNRCS is available to beneficiaries of the MediaGuard
                program. Tell us about your newsroom and what your team
                produces, and we will take it from there.
              </p>
              <Link
                className={clsx('button', 'button--lg', 'important-btn')}
                to="/apply?program=mediaguard"
              >
                Apply through MediaGuard
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
