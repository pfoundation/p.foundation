import clsx from 'clsx';
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './dubbing.module.scss';

const title = 'AI dubbing';
const description =
  'AI dubbing takes a finished video in one language to broadcast-ready cuts in others: transcript, translation, synthetic voices, the audio mix, on-screen graphics, and optional lip-sync, in one editor with a human in control of every step. Available to select MediaGuard partners.';

/* ------------------------------------------------------------------ */
/* Hooks and primitives                                               */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(
  threshold = 0.2
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/**
 * Fades content in as it scrolls into view. Content renders visible on the
 * server and is only hidden once JavaScript confirms it sits below the fold,
 * keeping the page readable without JS and avoiding any flash on load.
 */
const Reveal: FunctionComponent<{
  children: ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => {
  const [ref, inView] = useInView<HTMLDivElement>(0.12);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el && el.getBoundingClientRect().top > window.innerHeight * 0.92) {
      setArmed(true);
    }
  }, []);

  return (
    <div
      ref={ref}
      className={clsx(
        styles.reveal,
        armed && !inView && styles.revealHidden,
        className
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Hero: one source, many languages                                   */
/* ------------------------------------------------------------------ */

const FAN_LANGUAGES = ['Arabic', 'English', 'French', 'Persian'];

const HeroFan: FunctionComponent = () => {
  return (
    <div className={styles.fan} aria-hidden="true">
      <div className={styles.fanSource}>
        <span className={styles.fanSourceLabel}>Source</span>
        <span className={styles.fanWave}>
          {Array.from({ length: 7 }).map((_, index) => (
            <span
              key={index}
              style={{ '--pf-bar': index } as React.CSSProperties}
            />
          ))}
        </span>
        <span className={styles.fanSourceLang}>one video</span>
      </div>
      <ul className={styles.fanList}>
        {FAN_LANGUAGES.map((language, index) => (
          <li
            key={language}
            className={styles.fanRow}
            style={{ '--pf-line': index } as React.CSSProperties}
          >
            <span className={styles.fanWire}>
              <span className={styles.fanPulse} />
            </span>
            <span className={styles.fanLang}>{language}</span>
          </li>
        ))}
      </ul>
      <p className={styles.fanCaption}>
        One source video. Independent cuts in every language.
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* From source to dubbed cut: vertical flow                          */
/* ------------------------------------------------------------------ */

interface Step {
  name: string;
  accent: string;
  body: string;
}

const STEPS: Step[] = [
  {
    name: 'Transcript',
    accent: 'var(--pf-blue)',
    body: 'Three AI passes prepare the source: speaker-diarized transcription, audio separated into clean speech and background stems, and a vision pass that inventories every piece of burned-in text. The transcript is an editable document, and every segment carries a treatment.',
  },
  {
    name: 'Translation',
    accent: 'var(--pf-amber)',
    body: 'Each line is generated against its slot duration and the target language’s natural speaking rate, compressing or expanding the phrasing until it can be spoken in the time it has. Expressive delivery tags ride along and steer the synthesis.',
  },
  {
    name: 'Voices and mix',
    accent: 'var(--pf-green)',
    body: 'Each line is synthesized in its assigned voice and tempo-fitted to its slot. The compile places every take at its true timecode, ducks the original under voice-over segments, keeps original voices for CC, and lays the background bed underneath, producing a master mix plus stems.',
  },
  {
    name: 'On-screen graphics',
    accent: 'var(--pf-crimson)',
    body: 'Each language version translates the on-screen text inventory, and translated lower thirds render through HTML templates into transparent animated clips, previewed before they reach a final cut.',
  },
  {
    name: 'Optional lip-sync',
    accent: 'var(--pf-slate)',
    body: 'An AI model can re-animate the speakers’ mouths to match the dubbed audio, driven per voice stem and touching only the frames where someone is actually being dubbed. Long renders are resume-safe end to end.',
  },
  {
    name: 'The final cut',
    accent: 'var(--pf-blue)',
    body: 'Pick a base, compiled audio over the source picture or a lip-synced video, and a graphics version. The studio combines them without re-running anything upstream, and every cut records exactly which versions it sits on.',
  },
];

const StepFlow: FunctionComponent = () => (
  <ol className={styles.steps}>
    {STEPS.map((step, index) => (
      <li key={step.name} className={styles.step}>
        <span className={styles.stepMarker}>
          <span
            className={styles.stepNum}
            style={{
              borderColor: step.accent,
              backgroundColor: `color-mix(in srgb, ${step.accent} 16%, transparent)`,
            }}
          >
            {index + 1}
          </span>
        </span>
        <div className={styles.stepBody}>
          <h3 className={styles.stepName}>{step.name}</h3>
          <p className={styles.stepText}>{step.body}</p>
        </div>
      </li>
    ))}
  </ol>
);

/* ------------------------------------------------------------------ */
/* Translation built for the clock: slot diagram                     */
/* ------------------------------------------------------------------ */

type TfKind = 'source' | 'over' | 'fit';

interface TfRow {
  label: string;
  text: string;
  width: number; // percent of the track
  kind: TfKind;
}

// The slot boundary sits at 72% of the track. A word-for-word French
// rendering runs past it; the fitted line lands inside it.
const TF_SLOT = 72;

const TF_ROWS: TfRow[] = [
  {
    label: 'English source',
    text: 'We worked through the night to reach this agreement.',
    width: 64,
    kind: 'source',
  },
  {
    label: 'Word for word',
    text: 'Nous avons travaillé pendant toute la nuit afin de parvenir à cet accord.',
    width: 92,
    kind: 'over',
  },
  {
    label: 'Fitted to the clock',
    text: 'On a travaillé toute la nuit pour cet accord.',
    width: 66,
    kind: 'fit',
  },
];

const TF_BADGE: Record<TfKind, string> = {
  source: 'source',
  over: 'runs long',
  fit: 'fits',
};

const TranslationClock: FunctionComponent = () => (
  <div className={styles.tf}>
    <ul className={styles.tfRows}>
      {TF_ROWS.map((row) => (
        <li key={row.label} className={styles.tfRow}>
          <div className={styles.tfRowHead}>
            <span className={styles.tfRowLabel}>{row.label}</span>
            <span
              className={clsx(styles.tfBadge, styles[`tfBadge_${row.kind}`])}
            >
              {TF_BADGE[row.kind]}
            </span>
          </div>
          <p className={styles.tfRowText}>{row.text}</p>
          <div className={styles.tfBarTrack}>
            <span
              className={styles.tfSlotLine}
              style={{ left: `${TF_SLOT}%` }}
              aria-hidden="true"
            />
            <span
              className={clsx(styles.tfBar, styles[`tfBar_${row.kind}`])}
              style={{ width: `${row.width}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
    <p className={styles.tfSlotNote}>
      <span className={styles.tfSlotTick} aria-hidden="true" /> The line marks
      the segment&apos;s 4.4 second slot. A word-for-word rendering runs past
      it; the studio compresses the phrasing until it fits. Arabic and Persian
      compress differently again, and right-to-left scripts are handled
      throughout.
    </p>
  </div>
);

/* ------------------------------------------------------------------ */
/* Per-segment treatments: legend and timeline                       */
/* ------------------------------------------------------------------ */

type Treatment = 'lipsync' | 'dub' | 'cc' | 'discard';

const TREATMENTS: { key: Treatment; name: string; desc: string }[] = [
  {
    key: 'lipsync',
    name: 'Lip-sync',
    desc: 'Generated voice replaces the slot; mouths can be re-animated to match.',
  },
  {
    key: 'dub',
    name: 'Dub',
    desc: 'Generated voice plays over the original, which ducks underneath.',
  },
  {
    key: 'cc',
    name: 'CC',
    desc: 'Original voice kept as recorded; nothing is synthesized.',
  },
  {
    key: 'discard',
    name: 'Discard',
    desc: 'Cut from the dubbed timeline entirely.',
  },
];

const TIMELINE: { key: Treatment; grow: number; label: string }[] = [
  { key: 'lipsync', grow: 3, label: 'Lip-sync' },
  { key: 'dub', grow: 2, label: 'Dub' },
  { key: 'lipsync', grow: 3, label: 'Lip-sync' },
  { key: 'cc', grow: 2, label: 'CC' },
  { key: 'discard', grow: 1, label: 'cut' },
];

const Treatments: FunctionComponent = () => (
  <div className={styles.treat}>
    <div
      className={styles.treatTimeline}
      role="img"
      aria-label="A dubbed timeline mixing lip-sync, dub, and CC segments, with a discarded segment removed"
    >
      {TIMELINE.map((block, index) => (
        <span
          key={index}
          className={clsx(styles.treatBlock, styles[`treatBlock_${block.key}`])}
          style={{ flexGrow: block.grow }}
        >
          {block.label}
        </span>
      ))}
    </div>
    <ul className={styles.treatLegend}>
      {TREATMENTS.map((t) => (
        <li key={t.key} className={styles.treatItem}>
          <span
            className={clsx(styles.treatSwatch, styles[`treatSwatch_${t.key}`])}
            aria-hidden="true"
          />
          <div>
            <span className={styles.treatName}>{t.name}</span>
            <span className={styles.treatDesc}>{t.desc}</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function AiDubbingLanding(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <header className={styles.hero}>
        <div className={clsx('container', styles.heroInner)}>
          <div className={styles.heroCopy}>
            <span className={clsx('pf-kicker', styles.heroKicker)}>
              AI dubbing
            </span>
            <h1 className={styles.heroTitle}>
              One finished video.{' '}
              <span className={styles.heroAccent}>
                Broadcast-ready in every language.
              </span>
            </h1>
            <p className={styles.heroLede}>
              AI dubbing takes a finished video in one language to
              broadcast-ready cuts in others: transcript, translation, synthetic
              voices, the audio mix, on-screen graphics, and optional lip-sync,
              in one editor. The AI does the heavy lifting at each stage, and
              nothing advances until an editor has reviewed it.
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
              <a
                className={clsx('button', 'button--lg', styles.ghostBtn)}
                href="#flow"
              >
                See how it works
              </a>
            </div>
          </div>
          <HeroFan />
        </div>
      </header>

      <main>
        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">The problem</span>
              <h2>A dubbing chain, scattered across specialists</h2>
              <p className="pf-lede">
                Traditional dubbing is spread across a transcription house, a
                translator working against timecodes, voice talent in a booth,
                an audio engineer rebuilding the mix, and a graphics operator
                re-versioning the lower thirds, with weeks of round trips
                between them. AI dubbing folds that chain into one surface where
                the transcript, the timed translation, the generated voices, the
                stems, and the final picture are all views of the same project.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="flow" className={clsx('pf-section', styles.band)}>
          <div className="container">
            <Reveal>
              <span className="pf-kicker">How it works</span>
              <h2>From source to dubbed cut</h2>
              <p className="pf-lede">
                A project starts from a video already in the media library and
                ends with versioned, downloadable cuts. The AI drafts each
                stage; nothing advances until an editor has reviewed it, and
                every long stage renders in the background and re-attaches when
                you return.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <StepFlow />
            </Reveal>
          </div>
        </section>

        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">Translation built for the clock</span>
              <h2>A translation that fits the time it has</h2>
              <p className="pf-lede">
                Dubbing translation is timing work as much as language work.
                Each line is generated against its slot duration and the target
                language&apos;s natural speaking rate, and provenance tracking
                flags a translation, then its audio, stale the moment something
                upstream changes.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <TranslationClock />
            </Reveal>
          </div>
        </section>

        <section className={clsx('pf-section', styles.band)}>
          <div className="container">
            <Reveal>
              <span className="pf-kicker">Per-segment treatments</span>
              <h2>Every line gets the treatment it needs</h2>
              <p className="pf-lede">
                The transcript is editable, and each segment carries the dubbing
                it will receive. Statements that must stay authentic keep their
                original voice; overlap and chatter are cut. The dubbed timeline
                is built from those choices.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <Treatments />
            </Reveal>
          </div>
        </section>

        <section className={styles.source}>
          <div className="container">
            <Reveal>
              <span className={clsx('pf-kicker', styles.sourceKicker)}>
                One source, many languages
              </span>
              <h2 className={styles.sourceTitle}>
                A foundation that stops moving once you build on it
              </h2>
              <div className={styles.sourceGrid}>
                <div className={styles.sourceItem}>
                  <h3>Lock the source</h3>
                  <p>
                    Creating the first language version locks the source
                    transcript permanently. Every translation downstream is
                    anchored to that timing, and the foundation stops shifting
                    under the work built on it.
                  </p>
                </div>
                <div className={styles.sourceItem}>
                  <h3>Independent versions</h3>
                  <p>
                    Each language version lives its own life: its own
                    translations, voices, audio, graphics, and cuts, fully
                    independent of its siblings.
                  </p>
                </div>
                <div className={styles.sourceItem}>
                  <h3>A human at every step</h3>
                  <p>
                    The AI drafts each stage; nothing advances until an editor
                    has reviewed and corrected it. Provenance tracking keeps
                    translations and audio from drifting out of sync quietly.
                  </p>
                </div>
                <div className={styles.sourceItem}>
                  <h3>Runs in the background</h3>
                  <p>
                    Every long-running stage renders in the background with live
                    progress. Leave the page mid-render and the editor
                    re-attaches to the running work when you return.
                  </p>
                </div>
              </div>
              <div className={styles.langs}>
                <span className={styles.langsLabel}>
                  Current target languages
                </span>
                <ul className={styles.langsList}>
                  {FAN_LANGUAGES.map((language) => (
                    <li key={language} className={styles.langsChip}>
                      {language}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">Who it is for</span>
              <h2>Built for multi-language versioning</h2>
              <div className={styles.audienceGrid}>
                <div className={clsx('card', styles.audience)}>
                  <span className={styles.audienceLabel}>Broadcast</span>
                  <h3 className={styles.audienceTitle}>
                    Broadcasters re-versioning programming
                  </h3>
                  <p className={styles.audienceBody}>
                    Carry a finished program to other languages without a chain
                    of outside specialists. The transcript, the timed
                    translation, the voices, the mix, and the graphics are views
                    of the same project, and your own editors review every
                    stage.
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
            </Reveal>
          </div>
        </section>

        <section className={styles.cta}>
          <div className="container">
            <div className={styles.ctaInner}>
              <h2 className={styles.ctaTitle}>
                Carry your programming to every audience
              </h2>
              <p className={styles.ctaText}>
                AI dubbing is available to select MediaGuard partners as part of
                the AI inference support the foundation provides. Tell us about
                your organization and what you produce, and we will take it from
                there.
              </p>
              <div className={styles.ctaActions}>
                <Link
                  className={clsx('button', 'button--lg', 'important-btn')}
                  to="/apply?program=mediaguard"
                >
                  Apply through MediaGuard
                </Link>
                <Link
                  className={clsx('button', 'button--lg', styles.ghostBtn)}
                  to="/contact"
                >
                  Talk to us first
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
