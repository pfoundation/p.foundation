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

import styles from './opennrcs.module.scss';

const title = 'OpenNRCS';
const description =
  'OpenNRCS is a full newsroom computer system that carries one story across its entire life: from the wire, through writing and editorial review, into a timed rundown, on air, and out to the web and social platforms, all in one shared workspace. Available to MediaGuard partners.';

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
/* Hero: the wire-to-air pipeline visual                              */
/* ------------------------------------------------------------------ */

const PIPELINE = ['Wire', 'Feed', 'Story', 'Rundown', 'On air', 'Published'];

const HeroPipeline: FunctionComponent = () => {
  return (
    <div className={styles.pipeline} aria-hidden="true">
      <div className={styles.pipelineTrack}>
        <span className={styles.pipelineLine}>
          <span className={styles.pipelinePacket} />
        </span>
        <ol className={styles.pipelineStages}>
          {PIPELINE.map((label, index) => (
            <li
              key={label}
              className={styles.pipelineStage}
              style={{ '--pf-stage': index } as React.CSSProperties}
            >
              <span className={styles.pipelineDot} />
              {label}
            </li>
          ))}
        </ol>
      </div>
      <p className={styles.pipelineCaption}>
        One story, the same record at every step.
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Wire-to-air flow diagram                                           */
/* ------------------------------------------------------------------ */

interface FlowStage {
  name: string;
  body: string;
  accent: string;
}

const FLOW: FlowStage[] = [
  {
    name: 'Feed',
    accent: 'var(--pf-blue)',
    body: 'AFP, Reuters Connect, RSS, and Google News land in one live stream. An AI pass tags each open-feed item with a priority and a category and reformats it into clean Markdown, word for word. Promote any item into a story, pre-linked to its source.',
  },
  {
    name: 'Story',
    accent: 'var(--pf-crimson)',
    body: 'A story is written once and angled three ways: a TV script of typed blocks, a web article, and a social post. Spoken blocks time themselves at broadcast read rate, and clips lock to their real length, keeping the run time trustworthy.',
  },
  {
    name: 'Rundown',
    accent: 'var(--pf-green)',
    body: 'Stories drop into lettered segments against live timing columns: front time, back time, and over/under. Readiness chips show what is approved at a glance. Go live and advance story by story against the show clock.',
  },
  {
    name: 'Publish',
    accent: 'var(--pf-amber)',
    body: 'Approved web and social angles reach their destinations through an SEO editor with live previews, covering CMS platforms and social targets, each built from the matching angle.',
  },
];

const FlowDiagram: FunctionComponent = () => (
  <ol className={styles.flow}>
    {FLOW.map((stage, index) => (
      <React.Fragment key={stage.name}>
        <li className={styles.flowStep}>
          <div
            className={styles.flowNode}
            style={{ borderTopColor: stage.accent }}
          >
            <span className={styles.flowKicker}>Stage {index + 1}</span>
            <h3 className={styles.flowName}>{stage.name}</h3>
            <p className={styles.flowBody}>{stage.body}</p>
          </div>
        </li>
        {index < FLOW.length - 1 && (
          <li className={styles.flowArrow} aria-hidden="true">
            <span>›</span>
          </li>
        )}
      </React.Fragment>
    ))}
  </ol>
);

/* ------------------------------------------------------------------ */
/* One story, three angles branch diagram                            */
/* ------------------------------------------------------------------ */

const ANGLES: { name: string; body: string }[] = [
  { name: 'TV script', body: 'Typed blocks, timed to the second.' },
  { name: 'Web article', body: 'Headline, dek, and body for the site.' },
  { name: 'Social post', body: 'A platform-ready post and card.' },
];

const AnglesBranch: FunctionComponent = () => (
  <div className={styles.branch}>
    <div className={styles.branchSource}>
      <span className={styles.branchSourceKicker}>One record</span>
      <span className={styles.branchSourceName}>Story</span>
    </div>
    <ul className={styles.branchList}>
      {ANGLES.map((angle, index) => (
        <li
          key={angle.name}
          className={styles.branchRow}
          style={{ '--pf-line': index } as React.CSSProperties}
        >
          <span className={styles.branchWire} aria-hidden="true" />
          <div className={styles.branchNode}>
            <h3 className={styles.branchName}>{angle.name}</h3>
            <p className={styles.branchBody}>{angle.body}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

/* ------------------------------------------------------------------ */
/* Inside the workspace cards                                         */
/* ------------------------------------------------------------------ */

const CAPABILITIES: { title: string; body: string }[] = [
  {
    title: 'AI the newsroom steers',
    body: 'Three prompts the editorial team owns set the editorial direction, the anchor-read style, and the voice-over style. Every draft reads them, comes at the depth you choose, and writes the TV script, the web article, and the social post in one pass.',
  },
  {
    title: 'The assignment desk',
    body: 'Assignments run on a board from pitch through published. Every card is born with a story attached, and from then on story status and desk stage move together, with assignees, due dates, and field resources on each card.',
  },
  {
    title: 'Timed to the second',
    body: 'Spoken blocks time themselves from the text at broadcast read rate, and attaching a clip locks a block to its real length. The run time is built into the writing, and a story reaches the rundown already trustworthy.',
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function NrcsLanding(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <header className={styles.hero}>
        <div className={clsx('container', styles.heroInner)}>
          <div className={styles.heroCopy}>
            <span className={clsx('pf-kicker', styles.heroKicker)}>
              OpenNRCS
            </span>
            <h1 className={styles.heroTitle}>
              Every story, from wire to air,{' '}
              <span className={styles.heroAccent}>in one workspace</span>
            </h1>
            <p className={styles.heroLede}>
              A wire item, a broadcast script, a show clock, and a published
              article are usually four tools that drop context at every handoff.
              OpenNRCS makes them four views of one story, carried from the
              moment it lands on the wire, through writing and editorial review,
              into a timed rundown, on air, and out to the web and social
              platforms.
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
              <a
                className={clsx('button', 'button--lg', styles.ghostBtn)}
                href="#flow"
              >
                See how it works
              </a>
            </div>
          </div>
          <HeroPipeline />
        </div>
      </header>

      <main>
        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">The problem</span>
              <h2>Five tools, four places to lose the story</h2>
              <p className="pf-lede">
                Newsroom work has traditionally been split across a wire
                terminal, a script editor, a rundown application, a web CMS, and
                a social scheduler. Every boundary between them is a re-keyed
                headline, a timing that no longer matches, a correction that
                reaches air but never the website. OpenNRCS removes the
                boundaries by making every stage a view of one story record.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="flow" className={clsx('pf-section', styles.band)}>
          <div className="container">
            <Reveal>
              <span className="pf-kicker">How it works</span>
              <h2>From wire to air, one record the whole way</h2>
              <p className="pf-lede">
                A story can enter from any direction, promoted from a wire item
                or pitched on the assignment desk, and every module keeps
                pointing at the same underlying record.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <FlowDiagram />
            </Reveal>
          </div>
        </section>

        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">One story, three angles</span>
              <h2>Written once. Angled three ways.</h2>
              <p className="pf-lede">
                The three angles are tabs of one record, not three documents in
                three tools. Edit the story once and every angle stays in step;
                a correction made for air reaches the website too.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <AnglesBranch />
            </Reveal>
          </div>
        </section>

        <section className={clsx('pf-section', styles.band)}>
          <div className="container">
            <Reveal>
              <span className="pf-kicker">Inside the workspace</span>
              <h2>The desk, the AI, and the clock</h2>
              <p className="pf-lede">
                The same record carries through assignment, AI assistance, and
                timing, configured by the newsroom itself.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className={styles.capabilities}>
                {CAPABILITIES.map((item) => (
                  <div
                    key={item.title}
                    className={clsx('card', styles.capability)}
                  >
                    <h3 className={styles.capabilityTitle}>{item.title}</h3>
                    <p className={styles.capabilityBody}>{item.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.workspace}>
          <div className="container">
            <Reveal>
              <span className={clsx('pf-kicker', styles.workspaceKicker)}>
                One workspace
              </span>
              <h2 className={styles.workspaceTitle}>
                Everyone looking at the same story
              </h2>
              <div className={styles.workspaceGrid}>
                <div className={styles.workspaceItem}>
                  <h3>Shared by the whole team</h3>
                  <p>
                    The producer building the rundown, the reporter writing the
                    script, and the editor watching the desk are looking at the
                    same data, not exporting it between tools.
                  </p>
                </div>
                <div className={styles.workspaceItem}>
                  <h3>Configured by the newsroom</h3>
                  <p>
                    AI prompts, feed sources, rundown templates, and CG
                    templates are part of the workspace, which means the
                    system&apos;s behavior is set by the newsroom itself.
                  </p>
                </div>
                <div className={styles.workspaceItem}>
                  <h3>Right-to-left aware</h3>
                  <p>
                    The whole editor handles Arabic and other right-to-left
                    scripts, from the wire copy through the script to the
                    published article.
                  </p>
                </div>
                <div className={styles.workspaceItem}>
                  <h3>One record, no re-keying</h3>
                  <p>
                    A correction made once reaches the script, the rundown, and
                    every published angle, because they are views of a single
                    record.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">Who it is for</span>
              <h2>Built for desks that publish everywhere</h2>
              <div className={styles.audienceGrid}>
                <div className={clsx('card', styles.audience)}>
                  <span className={styles.audienceLabel}>Broadcast</span>
                  <h3 className={styles.audienceTitle}>Broadcast newsrooms</h3>
                  <p className={styles.audienceBody}>
                    Producers, reporters, and editors who put a daily show on
                    air share one workspace: the feed, the scripts, the rundown
                    clock, and the assignment desk all point at the same
                    stories.
                  </p>
                </div>
                <div className={clsx('card', styles.audience)}>
                  <span className={styles.audienceLabel}>Converged</span>
                  <h3 className={styles.audienceTitle}>Converged desks</h3>
                  <p className={styles.audienceBody}>
                    Desks that produce TV, web, and social from one team write
                    the story once, angle it three ways, and publish each angle
                    to its destination without leaving the workspace.
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
                Bring your newsroom onto one surface
              </h2>
              <p className={styles.ctaText}>
                OpenNRCS is available to MediaGuard partners. Tell us about your
                newsroom and what your team produces, and we will take it from
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
