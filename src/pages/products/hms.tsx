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

import styles from './hms.module.scss';

const title = 'Hosted Media Services';
const description =
  'Hosted Media Services (HMS) is one streaming backend for video on demand and live: a video library, plus live channels that HMS ingests and transcodes, time-shifts for DVR, and restreams to YouTube, Facebook, Twitch, and custom endpoints, delivering signed HLS that can ride OpenCache for local reach, with AI analysis native to the library. Available to MediaGuard partners.';

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
/* Hero: on-demand and live                                           */
/* ------------------------------------------------------------------ */

const SURFACE_TILES: { name: string; meta: string }[] = [
  { name: 'On-demand', meta: 'video library' },
  { name: 'Live', meta: 'stream · time-shift · restream' },
];

const Backbone: FunctionComponent = () => (
  <div className={styles.backbone} aria-hidden="true">
    <ul className={styles.backboneSurfaces}>
      {SURFACE_TILES.map((tile, index) => (
        <li
          key={tile.name}
          className={styles.backboneTile}
          style={{ '--pf-tile': index } as React.CSSProperties}
        >
          <span className={styles.backboneTileName}>{tile.name}</span>
          <span className={styles.backboneTileMeta}>{tile.meta}</span>
        </li>
      ))}
    </ul>
    <div className={styles.backboneConnect}>
      <span style={{ '--pf-wire': 0 } as React.CSSProperties} />
      <span style={{ '--pf-wire': 1 } as React.CSSProperties} />
    </div>
    <div className={styles.backboneCore}>
      <span className={styles.backboneCoreLabel}>HMS streaming backend</span>
      <span className={styles.backboneCoreMeta}>
        ingest · transcode · record · sign · deliver
      </span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* One backend, on-demand and live: selectable explorer               */
/* ------------------------------------------------------------------ */

type SurfaceKey = 'backend' | 'ondemand' | 'live';

interface SurfaceInfo {
  label: string;
  heading: string;
  body: string;
}

const SURFACES: Record<SurfaceKey, SurfaceInfo> = {
  backend: {
    label: 'HMS backend',
    heading: 'One backend does the heavy lifting',
    body: 'HMS ingests, transcodes, records, signs, and delivers, and that delivery can ride OpenCache for local reach. The console is the control surface that browses the library, runs live channels, configures restreams, and surfaces AI results. Everything is scoped to a project and shared by that project’s team.',
  },
  ondemand: {
    label: 'On-demand',
    heading: 'On-demand: the video library',
    body: 'Files arrive through resumable, chunked uploads and appear the moment they land, while transcoding produces streaming renditions, captions, and a storyboard in the background. Playback is a full HLS player on signed, expiring URLs, with storyboard scrubbing, picture-in-picture, chapters, and intro markers.',
  },
  live: {
    label: 'Live',
    heading: 'Live: streamed, transcoded, time-shifted',
    body: 'HMS ingests a live signal and transcodes it into a watchable channel. The channel is recorded into a time-shift buffer that lets viewers rewind, pause, and catch up (DVR), and it can be restreamed out to YouTube, Facebook, Twitch, or a custom endpoint. Low-latency channels preview live on hover.',
  },
};

const SURFACE_ORDER: SurfaceKey[] = ['ondemand', 'live'];

const SurfaceExplorer: FunctionComponent = () => {
  const [selected, setSelected] = useState<SurfaceKey>('ondemand');
  const info = SURFACES[selected];

  const stopButton = (key: SurfaceKey, extraClass?: string) => (
    <button
      type="button"
      className={clsx(
        styles.explorerStop,
        extraClass,
        selected === key && styles.explorerStopActive
      )}
      aria-pressed={selected === key}
      onClick={() => setSelected(key)}
    >
      <span className={styles.explorerStopName}>{SURFACES[key].label}</span>
    </button>
  );

  return (
    <div className={styles.explorer}>
      <div className={styles.explorerCanvas}>
        {stopButton('backend', styles.explorerCore)}
        <div className={styles.explorerSplit} aria-hidden="true">
          <span className={styles.explorerSplitText}>
            one backend, on-demand and live
          </span>
          <span className={styles.explorerSplitLine} />
        </div>
        <div className={styles.explorerSurfaces}>
          {SURFACE_ORDER.map((key) => stopButton(key))}
        </div>
      </div>

      <div className={styles.explorerDetail} aria-live="polite">
        <h3 className={styles.explorerDetailTitle}>{info.heading}</h3>
        <p className={styles.explorerDetailBody}>{info.body}</p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* On-demand: ingest lifecycle flow                                   */
/* ------------------------------------------------------------------ */

interface IngestStep {
  name: string;
  accent: string;
  body: string;
}

const INGEST: IngestStep[] = [
  {
    name: 'Upload',
    accent: 'var(--pf-blue)',
    body: 'Resumable and chunked. A dropped connection or a closed laptop resumes where it left off, in a floating panel that follows you across the app.',
  },
  {
    name: 'Transcode',
    accent: 'var(--pf-amber)',
    body: 'Renditions, captions, and a storyboard are generated in the background. A video reads as processing until they are ready, and the player waits for them.',
  },
  {
    name: 'Deliver',
    accent: 'var(--pf-green)',
    body: 'A full HLS player streams on signed, expiring URLs, re-signed on demand, with storyboard scrubbing as you seek and picture-in-picture that survives navigation.',
  },
];

const IngestFlow: FunctionComponent = () => (
  <ol className={styles.ingest}>
    {INGEST.map((step, index) => (
      <React.Fragment key={step.name}>
        <li className={styles.ingestStep}>
          <div
            className={styles.ingestNode}
            style={{ borderTopColor: step.accent }}
          >
            <span className={styles.ingestKicker}>Step {index + 1}</span>
            <h3 className={styles.ingestName}>{step.name}</h3>
            <p className={styles.ingestBody}>{step.body}</p>
          </div>
        </li>
        {index < INGEST.length - 1 && (
          <li className={styles.ingestArrow} aria-hidden="true">
            <span>›</span>
          </li>
        )}
      </React.Fragment>
    ))}
  </ol>
);

// Shared three-up capability cards, reused by every surface to give each
// equal weight.
const CapabilityCards: FunctionComponent<{
  items: { title: string; body: string }[];
}> = ({ items }) => (
  <div className={styles.tools}>
    {items.map((item) => (
      <div key={item.title} className={clsx('card', styles.tool)}>
        <h3 className={styles.toolTitle}>{item.title}</h3>
        <p className={styles.toolBody}>{item.body}</p>
      </div>
    ))}
  </div>
);

const LIBRARY_TOOLS: { title: string; body: string }[] = [
  {
    title: 'Organize',
    body: 'Free-text and shared programmable tags, season and episode numbers, custom thumbnails, intro markers, and chapters. A bulk-edit dialog applies status and tag changes across a whole selection at once.',
  },
  {
    title: 'Find',
    body: 'Search spans title, description, and the streaming key; filters narrow by status. A banner offers a refresh when new content arrives while you are looking at the list.',
  },
  {
    title: 'Play',
    body: 'Storyboard thumbnails preview as you scrub, keyboard shortcuts cover frame-stepping and seeking, and any video pops out into a picture-in-picture player. The detail page pairs the metadata form with the player and its chapter tools.',
  },
];

const LIVE_CAPS: { title: string; body: string }[] = [
  {
    title: 'Stream and transcode',
    body: 'Point a live signal at HMS and it transcodes the feed into streaming renditions, the same pipeline that backs the on-demand library.',
  },
  {
    title: 'Time-shift (DVR)',
    body: 'Every live channel is recorded into a buffer. Viewers rewind, pause, and catch up, and opening a channel hands off to the HMS player with full seek and time-shift across the recorded window.',
  },
  {
    title: 'Browse and preview',
    body: 'Channels are surfaced as a browse-and-launch grid with thumbnails that refresh in rotation, and a low-latency channel enlarges and plays live with sound on hover.',
  },
];

const RESTREAM_CAPS: { title: string; body: string }[] = [
  {
    title: 'One-step setup',
    body: 'Pick a live source previewed as you choose it, name the restream, choose a platform, and paste the stream key. For a custom target, give the server and stream name, and the console assembles the push URL.',
  },
  {
    title: 'Live status, mirrored',
    body: 'Each running restream shows the source-to-destination flow with a live connection indicator, a ticking duration, and the backend worker’s status.',
  },
  {
    title: 'One destination each',
    body: 'Active and recently stopped restreams are listed separately. One restream targets one destination, and stopping it archives the record.',
  },
];

const DELIVERY_CAPS: { title: string; body: string }[] = [
  {
    title: 'Signed, expiring URLs',
    body: 'Every play is authorized for a short window and re-signed on demand, across the on-demand library and live channels alike.',
  },
  {
    title: 'Embeds',
    body: 'Live channels and library items embed where your audience already is, carrying the same signed playback.',
  },
  {
    title: 'Local via OpenCache',
    body: 'Delivery can ride the foundation’s OpenCache network, serving playback from inside local networks for on-net latency and transit offload.',
  },
];

/* ------------------------------------------------------------------ */
/* AI on your videos                                                  */
/* ------------------------------------------------------------------ */

const AI_LAYERS: { title: string; body: string }[] = [
  {
    title: 'Extractions',
    body: 'On ingest, each video is analyzed into a structured summary: a suggested title, short and long descriptions, detected hosts and guests, subjects, top topics, the spoken language, and a speaker count. These are the raw material an editor curates from.',
  },
  {
    title: 'Chapter generation',
    body: 'For a longer analyzed video, the console turns the caption transcript into a clean set of chapters, each with an English and an Arabic title at the right timecode. Generation runs in the background and drops into the chapter editor, replacing nothing until you confirm.',
  },
];

/* ------------------------------------------------------------------ */
/* Live: time-shift buffer visual                                     */
/* ------------------------------------------------------------------ */

const TimeShiftBar: FunctionComponent = () => (
  <div className={styles.shift}>
    <div
      className={styles.shiftTrack}
      role="img"
      aria-label="A live channel recorded into a buffer running to the live edge, with the viewer rewound to an earlier point inside it"
    >
      <span className={styles.shiftBuffer} />
      <span className={styles.shiftHead} />
      <span className={styles.shiftLive}>
        <span className={styles.shiftLivePulse} />
      </span>
    </div>
    <div className={styles.shiftLabels}>
      <span>start of buffer</span>
      <span className={styles.shiftLabelHead}>viewer, rewound</span>
      <span className={styles.shiftLabelLive}>live edge</span>
    </div>
    <p className={styles.shiftNote}>
      The channel keeps recording at the live edge while the viewer watches an
      earlier point, then catches back up whenever they choose.
    </p>
  </div>
);

/* ------------------------------------------------------------------ */
/* Restream: live channels out to the platforms                       */
/* ------------------------------------------------------------------ */

const DESTINATIONS = ['YouTube', 'Facebook', 'Twitch', 'Custom RTMP / SRT'];

const RestreamFan: FunctionComponent = () => (
  <div className={styles.fan}>
    <div className={styles.fanSource}>
      <span className={styles.fanSourceKicker}>Live source</span>
      <span className={styles.fanSourceName}>Live channel</span>
    </div>
    <ul className={styles.fanList}>
      {DESTINATIONS.map((dest, index) => (
        <li
          key={dest}
          className={styles.fanRow}
          style={{ '--pf-line': index } as React.CSSProperties}
        >
          <span className={styles.fanWire} aria-hidden="true">
            <span className={styles.fanPulse} />
          </span>
          <span className={styles.fanNode}>{dest}</span>
        </li>
      ))}
    </ul>
    <p className={styles.fanNote}>
      One restream targets one destination. Sending a channel to several
      platforms is simply several restreams, each with its own live status.
    </p>
  </div>
);

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function HmsLanding(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <header className={styles.hero}>
        <div className={clsx('container', styles.heroInner)}>
          <div className={styles.heroCopy}>
            <span className={clsx('pf-kicker', styles.heroKicker)}>
              Hosted Media Services
            </span>
            <h1 className={styles.heroTitle}>
              On-demand and live video,{' '}
              <span className={styles.heroAccent}>
                on one streaming backend
              </span>
            </h1>
            <p className={styles.heroLede}>
              Hosting a video library and running live channels usually takes
              two separate systems. Hosted Media Services does both on one
              backend: an on-demand library, and a live side that ingests and
              transcodes a signal into a channel viewers can rewind and that you
              can restream to the platforms. On-demand and live become two views
              of the same media infrastructure.
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
          <Backbone />
        </div>
      </header>

      <main>
        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">The problem</span>
              <h2>On-demand and live, usually two stacks</h2>
              <p className="pf-lede">
                A video library and a live operation have traditionally meant
                two different systems: one to host and serve on-demand, another
                to ingest, transcode, time-shift, and restream live, each with
                its own delivery to wire up and its own bill. Hosted Media
                Services puts on-demand and live on one backend that signs and
                delivers every play.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="flow" className={clsx('pf-section', styles.band)}>
          <div className="container">
            <Reveal>
              <span className="pf-kicker">How it works</span>
              <h2>One backend, on-demand and live</h2>
              <p className="pf-lede">
                HMS does the ingesting, transcoding, recording, signing, and
                delivery; the console is the control surface on top. Select the
                backend or a surface to see what it does.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <SurfaceExplorer />
            </Reveal>
          </div>
        </section>

        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">On-demand</span>
              <h2>A video library, from upload to playback</h2>
              <p className="pf-lede">
                A video enters by upload and is ready to stream once HMS has
                transcoded it. The library is the workspace for everything that
                follows: organizing, editing, and playing back what you have
                uploaded.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <IngestFlow />
            </Reveal>
            <Reveal delay={150}>
              <CapabilityCards items={LIBRARY_TOOLS} />
            </Reveal>
          </div>
        </section>

        <section className={clsx('pf-section', styles.band)}>
          <div className="container">
            <Reveal>
              <span className="pf-kicker">AI on your videos</span>
              <h2>The library reads your content for you</h2>
              <p className="pf-lede">
                Two AI layers are native to the library, turning a raw upload
                into something an editor can curate rather than catalog by hand.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className={styles.aiGrid}>
                {AI_LAYERS.map((layer) => (
                  <div key={layer.title} className={clsx('card', styles.ai)}>
                    <h3 className={styles.aiTitle}>{layer.title}</h3>
                    <p className={styles.aiBody}>{layer.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={150}>
              <p className={styles.crossLink}>
                Deeper AI, editable transcription with speaker diarization and
                full dubbing into other languages, runs in the Inference studio
                on these same library items. See{' '}
                <Link to="/products/dubbing">AI dubbing</Link>.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">Live</span>
              <h2>Live channels, streamed and time-shifted</h2>
              <p className="pf-lede">
                On the live side, HMS ingests a live signal and transcodes it
                into a watchable channel. That channel is recorded into a
                time-shift buffer that lets viewers rewind, pause, and catch up
                rather than only watching the live edge.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <TimeShiftBar />
            </Reveal>
            <Reveal delay={150}>
              <CapabilityCards items={LIVE_CAPS} />
            </Reveal>
          </div>
        </section>

        <section className={clsx('pf-section', styles.band)}>
          <div className="container">
            <Reveal>
              <span className="pf-kicker">Restream</span>
              <h2>Take your live channels to the platforms</h2>
              <p className="pf-lede">
                Restream is the live side&apos;s way out. It re-broadcasts a
                live source, including the channels you run on HMS, to YouTube,
                Facebook, Twitch, or any custom RTMP, RTMPS, or SRT endpoint.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <RestreamFan />
            </Reveal>
            <Reveal delay={150}>
              <CapabilityCards items={RESTREAM_CAPS} />
            </Reveal>
          </div>
        </section>

        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">Content delivery</span>
              <h2>Signed delivery that can go local</h2>
              <p className="pf-lede">
                HMS does not only store and transcode; it signs and delivers
                every play, on-demand and live alike. Delivery is built in, and
                it can ride the foundation’s OpenCache network to serve from
                inside local networks.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <CapabilityCards items={DELIVERY_CAPS} />
            </Reveal>
            <Reveal delay={150}>
              <p className={styles.crossLink}>
                OpenCache is the foundation’s neutral, shared cache layer that
                serves content from inside local networks. See{' '}
                <Link to="/products/opencache">OpenCache</Link>.
              </p>
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
                Everyone working against the same backend
              </h2>
              <div className={styles.workspaceGrid}>
                <div className={styles.workspaceItem}>
                  <h3>Shared by the project</h3>
                  <p>
                    The library, live channels, and restreams live inside a
                    single project workspace, shared by everyone on that
                    project&apos;s team rather than exported between tools.
                  </p>
                </div>
                <div className={styles.workspaceItem}>
                  <h3>Gated by access policy</h3>
                  <p>
                    Full read and write for the media library and restreams,
                    browse-only for live channels. The producer, the editor, and
                    the live operator each get the access their role needs.
                  </p>
                </div>
                <div className={styles.workspaceItem}>
                  <h3>On-demand and live, one backend</h3>
                  <p>
                    An upload, a live channel, and a restream are different
                    views of the same media infrastructure, not separate
                    products bolted together after the fact.
                  </p>
                </div>
                <div className={styles.workspaceItem}>
                  <h3>AI native</h3>
                  <p>
                    Every video is analyzed on the way in, and the same items
                    feed transcription and dubbing in the Inference studio
                    without ever leaving the project.
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
              <h2>Built for teams running catalog and live at once</h2>
              <div className={styles.audienceGrid}>
                <div className={clsx('card', styles.audience)}>
                  <span className={styles.audienceLabel}>Broadcast</span>
                  <h3 className={styles.audienceTitle}>
                    Broadcasters with a catalog and live channels
                  </h3>
                  <p className={styles.audienceBody}>
                    Host the on-demand library and run live channels with a DVR
                    time-shift buffer, restreamed to the platforms, all from one
                    backend, delivered on signed URLs that can ride OpenCache.
                  </p>
                </div>
                <div className={clsx('card', styles.audience)}>
                  <span className={styles.audienceLabel}>Live</span>
                  <h3 className={styles.audienceTitle}>
                    Streaming and live operations
                  </h3>
                  <p className={styles.audienceBody}>
                    Stream and transcode a live signal into a channel, give
                    viewers a rewindable DVR window, and restream the same feed
                    to YouTube, Facebook, Twitch, and custom endpoints at once,
                    with each broadcast&apos;s status mirrored in the console.
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
                Bring your media onto one backend
              </h2>
              <p className={styles.ctaText}>
                Hosted Media Services is available to MediaGuard partners. Tell
                us about your organization and what you produce, and we will
                take it from there.
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
