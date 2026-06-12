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

const TranscriptIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <rect x="5" y="3.5" width="14" height="17" />
    <path d="M8.5 8h7" />
    <path d="M8.5 12h7" />
    <path d="M8.5 16h4.5" />
  </svg>
);

const TranslateIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <path d="M4 7h13" />
    <path d="m13.5 3.5 3.5 3.5-3.5 3.5" />
    <path d="M20 17H7" />
    <path d="m10.5 13.5-3.5 3.5 3.5 3.5" />
  </svg>
);

const WaveformIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <path d="M4 10v4" />
    <path d="M8 7v10" />
    <path d="M12 4v16" />
    <path d="M16 7v10" />
    <path d="M20 10v4" />
  </svg>
);

const LowerThirdIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" />
    <path d="M6 13.5h10" />
    <path d="M6 16h6" />
  </svg>
);

const LipSyncIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="9" cy="9.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="9.5" r="1" fill="currentColor" stroke="none" />
    <path d="M8 13.5c1.2 2 2.5 3 4 3s2.8-1 4-3" />
  </svg>
);

const ExportIcon = (
  <svg {...iconProps} role="img" aria-hidden="true">
    <rect x="3.5" y="4" width="17" height="12" />
    <path d="m10.2 7.5 4.3 2.5-4.3 2.5Z" />
    <path d="M7 20h10" />
  </svg>
);

interface Feature {
  title: string;
  body: string;
  iconClass: string;
  icon: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    title: 'The transcript',
    body: 'Three AI passes prepare the source: speaker-diarized transcription, audio separation into speech and background stems, and on-screen text detection. The result is an editable working document: retime, split, and merge segments, and watch crosstalk in a per-speaker timeline view. Each segment carries a treatment: Lipsync replaces the slot entirely, Dub plays over the original speech as it ducks underneath, CC keeps the original voice, and Discard cuts it from the dubbed timeline.',
    iconClass: styles.iconBlue,
    icon: TranscriptIcon,
  },
  {
    title: 'Translation built for the clock',
    body: "Each line is generated against its slot duration and the target language's natural speaking rate, so it can actually be spoken in the time available. Expressive delivery tags ride along in the text and steer the voice synthesis. Provenance tracking flags a translation as stale when the source text changes, and flags the audio as stale when a translation or voice changes, so nothing silently drifts out of sync.",
    iconClass: styles.iconAmber,
    icon: TranslateIcon,
  },
  {
    title: 'Voices and audio',
    body: "Each segment's line is synthesized in a voice assigned from the project's voices library, then tempo-fitted to its slot. The compile step assembles the full-length audio and produces a master mix plus stems (one per voice, one per CC speaker, and one for the background bed), so the mix can be inspected track by track or taken into an external audio suite. Compiles are versioned.",
    iconClass: styles.iconGreen,
    icon: WaveformIcon,
  },
  {
    title: 'On-screen graphics',
    body: 'A detection pass inventories every piece of burned-in text with its time window, position, and category, and the inventory is reviewable on the player itself. Each language version translates that inventory, and translated lower thirds render through HTML templates into transparent animated clips, previewed before they are committed to a final cut.',
    iconClass: styles.iconCrimson,
    icon: LowerThirdIcon,
  },
  {
    title: 'Optional lip-sync',
    body: "Optionally, an AI model re-animates the speakers' mouths to match the dubbed audio. Generation is driven per stem, with each voice mapped to the picture segment by segment, so the model only touches frames where someone is actually being dubbed. CC and discarded ranges keep their original frames, and long renders are resume-safe end to end.",
    iconClass: styles.iconSlate,
    icon: LipSyncIcon,
  },
  {
    title: 'Review and export',
    body: 'The editor plays the work at every stage: original or dubbed audio against the picture, continuous segment-by-segment playback of the generated takes, and per-stem listening on any compile. Transcripts and translations export to CSV, SRT, WebVTT, and a print-ready PDF dubbing script, with right-to-left scripts handled throughout.',
    iconClass: styles.iconBlue,
    icon: ExportIcon,
  },
];

const LANGUAGES = ['Arabic', 'English', 'French', 'Persian'];

const title = 'Dubbing';
const description =
  'Dubbing is an AI dubbing studio available to select MediaGuard partners as part of the AI inference support P Foundation provides. It takes a finished video in one language and carries it to broadcast-ready cuts in other languages: transcript, translation, synthetic voices, the audio mix, on-screen graphics, and optional lip-sync, in one editor with a human in control of every step.';

export default function DubbingPage(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <header className={styles.hero}>
        <div className={clsx('container', styles.heroInner)}>
          <span className={clsx('pf-kicker', styles.heroKicker)}>Product</span>
          <h1 className={styles.heroTitle}>Dubbing</h1>
          <p className={styles.heroLede}>
            Dubbing is an AI dubbing studio. It takes a finished video in one
            language and carries it to broadcast-ready cuts in other languages:
            transcript, translation, synthetic voices, the audio mix, on-screen
            graphics, and optional lip-sync, all in one editor, with a human in
            control of every step.
          </p>
          <p className={styles.heroAvailability}>
            Available to select MediaGuard partners
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
            <h2>From a chain of specialists to one surface</h2>
            <div className={styles.sectionBody}>
              <p>
                A traditional dubbing chain is scattered across specialists: a
                transcription house, a translator working against timecodes,
                voice talent in a booth, an audio engineer rebuilding the mix, a
                graphics operator re-versioning the lower thirds, and weeks of
                round trips between all of them. Dubbing folds that chain into a
                single surface where the source transcript, the timed
                translation, the generated voices, the stems, and the final
                picture are all views of the same project. The AI does the heavy
                lifting at each stage, and nothing advances to the next stage
                until an editor has had the chance to review and correct it.
              </p>
            </div>
          </div>
        </section>

        <section className={clsx('pf-section', styles.band)}>
          <div className="container">
            <span className="pf-kicker">How it works</span>
            <h2>From source to dubbed cut</h2>
            <div className={styles.featureGrid}>
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className={clsx('card', styles.feature)}
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
            <div className={styles.languages}>
              <span className={styles.languagesLabel}>
                Current target languages
              </span>
              <ul className={styles.languageList}>
                {LANGUAGES.map((language) => (
                  <li key={language} className={styles.languageChip}>
                    {language}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="pf-section">
          <div className="container">
            <span className="pf-kicker">Who it is for</span>
            <h2>Built for multi-language versioning</h2>
            <div className={styles.sectionBody}>
              <p>
                Dubbing is part of the AI inference support the foundation
                provides, and it is available to select partners in the
                MediaGuard program.
              </p>
            </div>
            <div className={styles.audienceGrid}>
              <div className={clsx('card', styles.audience)}>
                <span className={styles.audienceLabel}>Broadcast</span>
                <h3 className={styles.audienceTitle}>
                  Broadcasters re-versioning programming
                </h3>
                <p className={styles.audienceBody}>
                  Carry a finished program to other languages without a chain of
                  outside specialists: the transcript, the timed translation,
                  the voices, the mix, and the graphics are views of the same
                  project, and your own editors review every stage.
                </p>
              </div>
              <div className={clsx('card', styles.audience)}>
                <span className={styles.audienceLabel}>News</span>
                <h3 className={styles.audienceTitle}>
                  Newsrooms carrying reporting across languages
                </h3>
                <p className={styles.audienceBody}>
                  Take reporting to audiences in other languages with
                  broadcast-ready cuts. Per-segment treatments keep statements
                  in their original voice where they must stay authentic, and
                  right-to-left scripts are handled throughout.
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
                Dubbing is available to select MediaGuard partners. Apply
                through the MediaGuard program, tell us about your organization,
                and we will take it from there.
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
