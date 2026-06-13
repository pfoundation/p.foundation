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

import styles from './opencache.module.scss';

const title = 'OpenCache';
const description =
  'OpenCache serves your content from inside local networks: cache nodes at internet exchanges and inside ISP networks, operated end to end by P Foundation. Free for content providers, who cut their CDN fees, and free for host ISPs, who cut their international transit costs.';

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

const CountUp: FunctionComponent<{
  to: number;
  start: boolean;
  duration?: number;
}> = ({ to, start, duration = 1500 }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) {
      return undefined;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return undefined;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const progress = Math.min(1, (t - t0) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(to * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, duration]);

  return <>{value}</>;
};

/* ------------------------------------------------------------------ */
/* Hero: the route race                                               */
/* ------------------------------------------------------------------ */

const RouteRace: FunctionComponent = () => {
  return (
    <div className={styles.race} aria-hidden="true">
      <div className={styles.lane}>
        <div className={styles.laneHeader}>
          <span className={styles.laneLabel}>Without OpenCache</span>
          <span className={clsx(styles.laneBadge, styles.laneBadgeSlow)}>
            ~50 ms detour, every request
          </span>
        </div>
        <div className={styles.laneTrack}>
          <span className={styles.laneStop}>Your user</span>
          <span className={styles.laneLine}>
            <span className={clsx(styles.lanePacket, styles.lanePacketSlow)} />
          </span>
          <span className={styles.laneStop}>Origin, another continent</span>
        </div>
      </div>
      <div className={styles.lane}>
        <div className={styles.laneHeader}>
          <span className={styles.laneLabel}>With OpenCache</span>
          <span className={clsx(styles.laneBadge, styles.laneBadgeFast)}>
            served on-net, misses only
          </span>
        </div>
        <div className={styles.laneTrack}>
          <span className={styles.laneStop}>Your user</span>
          <span className={clsx(styles.laneLine, styles.laneLineShort)}>
            <span className={clsx(styles.lanePacket, styles.lanePacketFast)} />
          </span>
          <span className={clsx(styles.laneStop, styles.laneStopHit)}>
            Local cache node
          </span>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Proof band                                                         */
/* ------------------------------------------------------------------ */

interface Stat {
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
}

const STATS: Stat[] = [
  {
    value: 97,
    suffix: '%',
    label: 'of on-demand requests served straight from the local cache',
  },
  {
    prefix: 'up to ',
    value: 85,
    suffix: '%',
    label: 'of live streaming requests served locally',
  },
  {
    value: 3,
    suffix: ' in 100',
    label: 'on-demand requests that ever travel to the origin',
  },
  {
    prefix: '~',
    value: 50,
    suffix: ' ms',
    label: 'of round-trip detour removed when delivery moves on-net',
  },
];

const ProofBand: FunctionComponent = () => {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div ref={ref} className={styles.statsGrid}>
      {STATS.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <span className={styles.statValue}>
            {stat.prefix}
            <CountUp to={stat.value} start={inView} />
            {stat.suffix}
          </span>
          <span className={styles.statLabel}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Offload simulator                                                  */
/* ------------------------------------------------------------------ */

type DeliveryKind = 'general' | 'streaming';

const KIND_LABEL: Record<DeliveryKind, string> = {
  general: 'General delivery',
  streaming: 'Streaming hours',
};

// Cache effectiveness is not fixed: the more you serve, the better the cache
// performs, because popular objects stay hot and request collapsing amortizes
// across more demand. Each delivery type rises from a small-deployment floor
// toward the ceiling measured on production traffic (97% on-demand, up to 85%
// live). The RATE_CURVE exponent gives diminishing returns as volume grows.
interface RateModel {
  floor: number;
  ceiling: number;
}

const RATE_MODEL: Record<DeliveryKind, RateModel> = {
  general: { floor: 0.8, ceiling: 0.97 },
  streaming: { floor: 0.58, ceiling: 0.85 },
};

const RATE_CURVE = 2.4;

// Effectiveness as a function of slider position (which maps to volume): rises
// fast at first, then saturates toward the measured ceiling at scale.
function cacheRate(kind: DeliveryKind, position: number): number {
  const { floor, ceiling } = RATE_MODEL[kind];
  const x = position / 100;
  return ceiling - (ceiling - floor) * (1 - x) ** RATE_CURVE;
}

const HIT_RATE_NOTES: Record<DeliveryKind, string> = {
  general:
    'Cache effectiveness climbs with volume, approaching the 97% measured on production on-demand traffic at scale.',
  streaming:
    'Cache effectiveness climbs with volume toward the measured 80-85% for live content. Streaming hours assume ~2 GB per hour (about 4.4 Mbps).',
};

// Streaming volume is expressed in hours; this converts an hour of streaming
// to delivered data (1 TB = 1000 GB).
const GB_PER_STREAM_HOUR = 2;

// Assumed international transit price the offloaded bandwidth would otherwise
// be billed at.
const PRICE_PER_TB = 9.99;

// Slider position 0-100 maps logarithmically to monthly delivered volume.
// Tuned so the default position (55) lands on ~1 PB (1000 TB):
//   10 ** (1 + 0.55 * 3.64) ≈ 1004 TB. Range spans ~10 TB to ~44 PB.
function positionToTB(position: number): number {
  return 10 ** (1 + (position / 100) * 3.64);
}

function formatUSD(n: number): string {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function formatData(tb: number): string {
  if (tb >= 1000) {
    const pb = tb / 1000;
    return `${
      pb >= 10 ? Math.round(pb).toLocaleString('en-US') : pb.toFixed(1)
    } PB`;
  }
  if (tb >= 10) {
    return `${Math.round(tb).toLocaleString('en-US')} TB`;
  }
  return `${tb.toFixed(1)} TB`;
}

function formatHours(hours: number): string {
  return Math.round(hours).toLocaleString('en-US');
}

const OffloadSimulator: FunctionComponent = () => {
  const [kind, setKind] = useState<DeliveryKind>('general');
  // Default at 55: ~1 PB of monthly delivery (see positionToTB).
  const [position, setPosition] = useState(55);

  const totalTB = positionToTB(position);
  const rate = cacheRate(kind, position);
  const ratePct = Math.round(rate * 100);
  const localTB = totalTB * rate;
  const originTB = totalTB - localTB;
  const savings = localTB * PRICE_PER_TB;

  // For streaming, express the same volume as hours delivered.
  const totalHours = (totalTB * 1000) / GB_PER_STREAM_HOUR;
  const localHours = totalHours * rate;

  return (
    <div className={clsx('card', styles.sim)}>
      <div className={styles.simControls}>
        <div
          className={styles.simSegment}
          role="group"
          aria-label="Delivery type"
        >
          {(['general', 'streaming'] as DeliveryKind[]).map((key) => (
            <button
              key={key}
              type="button"
              className={clsx(
                styles.simSegmentBtn,
                kind === key && styles.simSegmentBtnActive
              )}
              aria-pressed={kind === key}
              onClick={() => setKind(key)}
            >
              {KIND_LABEL[key]}
            </button>
          ))}
        </div>
        <label className={styles.simSlider}>
          <span className={styles.simSliderLabel}>
            {kind === 'streaming' ? (
              <>
                Monthly streaming:{' '}
                <strong>{formatHours(totalHours)} hours</strong> (
                {formatData(totalTB)})
              </>
            ) : (
              <>
                Monthly delivery: <strong>{formatData(totalTB)}</strong>
              </>
            )}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            aria-label={
              kind === 'streaming'
                ? 'Monthly streaming hours'
                : 'Monthly delivery volume'
            }
          />
        </label>
      </div>

      <div className={styles.simBarHead}>
        <span className={styles.simBarHeadLabel}>Cache effectiveness</span>
        <span className={styles.simBarHeadValue}>{ratePct}%</span>
      </div>
      <div
        className={styles.simBar}
        role="img"
        aria-label={`${ratePct}% cache effectiveness: ${formatData(
          localTB
        )} served locally, ${formatData(originTB)} reach your origin`}
      >
        <span
          className={styles.simBarLocal}
          style={{ width: `${rate * 100}%` }}
        />
        <span className={styles.simBarOrigin} />
      </div>

      <div className={styles.simSavings}>
        <div className={styles.simSavingsHead}>
          <span className={styles.simSavingsValue}>{formatUSD(savings)}</span>
          <span className={styles.simSavingsUnit}>saved per month</span>
        </div>
        <p className={styles.simSavingsSub}>
          About <strong>{formatData(localTB)}</strong> served from inside the
          network, bandwidth you would otherwise pay transit on at $9.99/TB.
        </p>
      </div>

      <div className={styles.simReadout}>
        <div className={styles.simFigure}>
          <span className={clsx(styles.simDot, styles.simDotLocal)} />
          <div>
            <span className={styles.simNumber}>
              {kind === 'streaming'
                ? `${formatHours(localHours)} hrs`
                : formatData(localTB)}
            </span>
            <span className={styles.simCaption}>
              served from inside the network, at no cost to you
            </span>
          </div>
        </div>
        <div className={styles.simFigure}>
          <span className={clsx(styles.simDot, styles.simDotOrigin)} />
          <div>
            <span className={styles.simNumber}>{formatData(originTB)}</span>
            <span className={styles.simCaption}>
              served from your origin or partner CDN
            </span>
          </div>
        </div>
        <div className={styles.simFigure}>
          <span className={clsx(styles.simDot, styles.simDotQuiet)} />
          <div>
            <span className={styles.simNumber}>{100 - ratePct}%</span>
            <span className={styles.simCaption}>
              of the demand your origin actually sees
            </span>
          </div>
        </div>
      </div>

      <p className={styles.simNote}>
        {HIT_RATE_NOTES[kind]} Transit billed at $9.99/TB; your figures depend
        on your traffic mix.
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Interactive network diagram                                        */
/* ------------------------------------------------------------------ */

type StopKey = 'control' | 'exchange' | 'isp' | 'origin';

interface StopInfo {
  label: string;
  heading: string;
  body: string;
}

const STOPS: Record<StopKey, StopInfo> = {
  control: {
    label: 'Control plane',
    heading: 'P Foundation operates the control plane',
    body: 'Per-provider site configs, fleet-wide traffic policies, telemetry, and dashboards live centrally. Nodes pull declarative configuration, validate it, and apply it with a zero-downtime reload. Hosting a node grants no access to any of it.',
  },
  isp: {
    label: 'Nodes inside ISPs',
    heading: 'Subscribers served from on-net',
    body: 'A node inside an ISP serves that ISP’s subscribers from on-net and offloads its transit. A listen-only BGP session teaches it exactly which prefixes are local, and a health score reported every 15 seconds steers traffic away from a draining or saturated node before users notice.',
  },
  exchange: {
    label: 'Node at the exchange',
    heading: 'A shared parent cache for the whole exchange',
    body: 'When an ISP node misses, and that ISP peers at the exchange, it pulls from the node at the exchange over local peering instead of reaching abroad. That node serves every peering network directly and acts as a shared upstream for all of them, which means an object first requested through one ISP is already warm for the next. The more ISPs that peer in and run their own nodes, the more misses stay inside the country.',
  },
  origin: {
    label: 'Your origin',
    heading: 'Only the last miss leaves the country',
    body: 'A request reaches your origin only when both the ISP node and the exchange node miss. Even then, one collapsed request fetches the object while every concurrent client waits, stale serving covers revalidation and origin errors, and multiple origins fail over with health-aware retries.',
  },
};

const NetworkDiagram: FunctionComponent = () => {
  const [selected, setSelected] = useState<StopKey>('isp');
  const info = STOPS[selected];

  const stopButton = (key: StopKey, label?: string, extraClass?: string) => (
    <button
      type="button"
      className={clsx(
        styles.diagramStop,
        extraClass,
        selected === key && styles.diagramStopActive
      )}
      aria-pressed={selected === key}
      onClick={() => setSelected(key)}
    >
      {label ?? STOPS[key].label}
    </button>
  );

  return (
    <div className={styles.diagram}>
      <div className={styles.diagramCanvas}>
        {stopButton('control', undefined, styles.diagramFull)}
        <div className={styles.diagramFlow} aria-hidden="true">
          <span className={styles.diagramFlowLine} />
          <span className={styles.diagramFlowText}>
            config flows down, telemetry flows up
          </span>
          <span className={styles.diagramFlowLine} />
        </div>

        <p className={styles.diagramTier}>
          Subscribers hit the node in their own ISP first
        </p>
        <div className={styles.diagramNodes}>
          <div className={styles.diagramBranch}>
            {stopButton('isp', 'ISP A node')}
            <span className={styles.diagramDrop} aria-hidden="true" />
            <span className={styles.diagramAudience}>ISP A subscribers</span>
          </div>
          <div className={styles.diagramBranch}>
            {stopButton('isp', 'ISP B node')}
            <span className={styles.diagramDrop} aria-hidden="true" />
            <span className={styles.diagramAudience}>ISP B subscribers</span>
          </div>
        </div>

        <div className={styles.diagramStep} aria-hidden="true">
          <span className={styles.diagramStepLabel}>
            on a miss, both pull from the exchange over local peering
          </span>
          <span className={styles.diagramStepArrow} />
        </div>

        {stopButton('exchange', undefined, styles.diagramExchange)}
        <p className={styles.diagramExchangeNote} aria-hidden="true">
          shared parent cache, also serving every network peering at the
          exchange directly
        </p>

        <div className={styles.diagramMiss}>
          <span className={styles.diagramMissLabel}>
            second miss only: international transit
          </span>
          <span className={styles.diagramMissArrow} aria-hidden="true" />
          {stopButton('origin', undefined, styles.diagramOrigin)}
        </div>
      </div>

      <div className={styles.diagramDetail} aria-live="polite">
        <h3 className={styles.diagramDetailTitle}>{info.heading}</h3>
        <p className={styles.diagramDetailBody}>{info.body}</p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Provider feature tabs                                              */
/* ------------------------------------------------------------------ */

interface TabDef {
  key: string;
  label: string;
  heading: string;
  body: string;
  mock: { left: string; right: string }[];
}

const TABS: TabDef[] = [
  {
    key: 'tls',
    label: 'Domains and TLS',
    heading: 'Bring a domain, get the edge',
    body: 'Per-provider certificates are issued automatically through ACME, or you supply your own. TLS terminates inside the foundation-operated node, never on host hardware, and every client negotiates HTTP/1.1, HTTP/2, or HTTP/3 over QUIC.',
    mock: [
      { left: 'cdn.example.org', right: 'active' },
      { left: 'certificate', right: 'auto (ACME), valid' },
      { left: 'protocols', right: 'h3 / h2 / http1.1' },
    ],
  },
  {
    key: 'origins',
    label: 'Origins and failover',
    heading: 'Your origin, protected by default',
    body: 'Configure multiple origins with health-aware retries. Request collapsing sends one fetch upstream when a popular object expires, and stale serving keeps responses flowing while a node revalidates or your origin errors, within bounds you configure.',
    mock: [
      { left: 'origin-a.example.org', right: 'healthy, primary' },
      { left: 'origin-b.example.org', right: 'healthy, backup' },
      { left: 'collapsing / stale serving', right: 'always on' },
    ],
  },
  {
    key: 'rules',
    label: 'Cache rules',
    heading: 'Per-route control, applied fleet-wide',
    body: 'Declare TTLs, cache keys, query normalization, CORS, and stale behavior per route. Rules are validated centrally and rendered to every node with a zero-downtime reload, and the same rules are enforced uniformly across the whole fleet.',
    mock: [
      { left: '/video/*', right: 'ttl 6h, normalized keys' },
      { left: '/static/*', right: 'ttl 30d' },
      { left: '/api/*', right: 'bypass' },
    ],
  },
  {
    key: 'observability',
    label: 'Observability',
    heading: 'Every request explains itself',
    body: 'Every response carries cache status and edge-timing headers, and every node exposes a trace endpoint, letting a client report be correlated to a specific node, rule, and origin fetch. Delivery dashboards break traffic down per ISP and per network.',
    mock: [
      { left: 'cache status', right: 'HIT' },
      { left: 'served by', right: 'node at the exchange' },
      { left: 'dashboards', right: 'per ISP, per network' },
    ],
  },
];

const FeatureTabs: FunctionComponent = () => {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = TABS[active];

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }
    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const next = (active + delta + TABS.length) % TABS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className={styles.tabs}>
      <div
        className={styles.tabList}
        role="tablist"
        aria-label="Provider features"
        onKeyDown={onKeyDown}
      >
        {TABS.map((def, index) => (
          <button
            key={def.key}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`oc-tab-${def.key}`}
            aria-selected={index === active}
            aria-controls={`oc-panel-${def.key}`}
            tabIndex={index === active ? 0 : -1}
            className={clsx(
              styles.tabBtn,
              index === active && styles.tabBtnActive
            )}
            onClick={() => setActive(index)}
          >
            {def.label}
          </button>
        ))}
      </div>

      <div
        key={tab.key}
        role="tabpanel"
        id={`oc-panel-${tab.key}`}
        aria-labelledby={`oc-tab-${tab.key}`}
        className={styles.tabPanel}
      >
        <div className={styles.tabCopy}>
          <h3 className={styles.tabHeading}>{tab.heading}</h3>
          <p className={styles.tabBody}>{tab.body}</p>
        </div>
        <div className={styles.tabMock} aria-hidden="true">
          {tab.mock.map((row) => (
            <div key={row.left} className={styles.tabMockRow}>
              <span className={styles.tabMockLeft}>{row.left}</span>
              <span className={styles.tabMockRight}>{row.right}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function OpenCacheLanding(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <header className={styles.hero}>
        <div className={clsx('container', styles.heroInner)}>
          <div className={styles.heroCopy}>
            <span className={clsx('pf-kicker', styles.heroKicker)}>
              OpenCache
            </span>
            <h1 className={styles.heroTitle}>
              Serve your content{' '}
              <span className={styles.heroAccent}>from inside the network</span>
            </h1>
            <p className={styles.heroLede}>
              The largest platforms localized their delivery years ago with
              embedded caches inside ISPs and exchanges. OpenCache makes that
              same model available to every content provider, free of charge: a
              neutral, shared cache layer operated end to end by P Foundation,
              with no CDN of your own to build or pay for.
            </p>
            <div className={styles.heroActions}>
              <Link
                className={clsx('button', 'button--lg', 'important-btn')}
                to="/apply/opencache?as=provider"
              >
                Start serving
              </Link>
              <Link
                className={clsx('button', 'button--lg', styles.ghostBtn)}
                href="https://console.p.foundation/docs/opencache"
              >
                Read the docs
              </Link>
            </div>
          </div>
          <RouteRace />
        </div>
      </header>

      <main>
        <section className={clsx('pf-section', styles.proofSection)}>
          <div className="container">
            <Reveal>
              <span className="pf-kicker">Proven on real traffic</span>
              <h2>Three months of production numbers</h2>
              <p className="pf-lede">
                OpenCache did not launch as a promise. Multiple content
                providers ran production traffic through it for three months
                before this page existed.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <ProofBand />
            </Reveal>
          </div>
        </section>

        <section className={clsx('pf-section', styles.band)}>
          <div className="container">
            <Reveal>
              <span className="pf-kicker">What it means for you</span>
              <h2>Estimate the offload</h2>
              <p className="pf-lede">
                Move the slider to your monthly volume. The more you serve, the
                more effective the cache becomes, and the larger the share of
                delivery you stop paying CDN fees for. Users get local latency;
                your origin carries a fraction of its former load.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <OffloadSimulator />
            </Reveal>
          </div>
        </section>

        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">What it costs</span>
              <h2>Free to serve. Free to host.</h2>
              <p className="pf-lede">
                OpenCache is nonprofit infrastructure, operated by P Foundation
                and open on equal terms.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className={styles.pricingGrid}>
                <div className={clsx('card', styles.pricingCard)}>
                  <span className={styles.pricingWho}>Content providers</span>
                  <span className={styles.pricingPrice}>Free</span>
                  <p>
                    Serving through OpenCache costs nothing. Every request
                    delivered from a local cache node is a request you no longer
                    pay CDN fees for; partner CDNs carry only the remainder
                    outside the footprint.
                  </p>
                </div>
                <div
                  className={clsx(
                    'card',
                    styles.pricingCard,
                    styles.pricingCardAlt
                  )}
                >
                  <span className={styles.pricingWho}>Host ISPs</span>
                  <span className={styles.pricingPrice}>Free</span>
                  <p>
                    The node is provided and operated at no cost. Every byte
                    served on-net is a byte that never crosses your
                    international transit links, cutting the transit bill for
                    all participating providers&apos; content at once.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">How it works</span>
              <h2>One platform, tiered to stay local</h2>
              <p className="pf-lede">
                Every node runs the same platform under one control plane; what
                differs is the network it serves. A miss does not jump straight
                abroad: it falls through to the node at the exchange first.
                Select any part of the path to see what it does.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <NetworkDiagram />
            </Reveal>
            <Reveal delay={150}>
              <p className={styles.crossLink}>
                Want the full detail? Read the{' '}
                <Link href="https://console.p.foundation/docs/opencache">
                  runtime documentation
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </section>

        <section className={clsx('pf-section', styles.band)}>
          <div className="container">
            <Reveal>
              <span className="pf-kicker">For content providers</span>
              <h2>Onboard in four moves</h2>
              <p className="pf-lede">
                You keep your origin and full authority over your content.
                OpenCache localizes the delivery.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <FeatureTabs />
            </Reveal>
          </div>
        </section>

        <section className={styles.neutrality}>
          <div className="container">
            <Reveal>
              <span className={clsx('pf-kicker', styles.neutralityKicker)}>
                Neutral by architecture
              </span>
              <h2 className={styles.neutralityTitle}>
                The data plane spreads. The control plane does not.
              </h2>
              <div className={styles.neutralityGrid}>
                <div className={styles.neutralityItem}>
                  <h3>Hosting grants no control</h3>
                  <p>
                    An ISP hosting a node provides space, power, and
                    connectivity. It gains no access to provider configuration,
                    certificates, or traffic policies.
                  </p>
                </div>
                <div className={styles.neutralityItem}>
                  <h3>TLS stays inside the node</h3>
                  <p>
                    Certificates live and terminate inside the
                    foundation-operated node. A host network cannot
                    reprioritize, alter, or selectively degrade the content its
                    node serves.
                  </p>
                </div>
                <div className={styles.neutralityItem}>
                  <h3>One policy engine, every node</h3>
                  <p>
                    The same policy engine, the same observability, and the same
                    operational team cover the whole fleet, in the same way a
                    neutral exchange offers the same terms to every participant.
                  </p>
                </div>
                <div className={styles.neutralityItem}>
                  <h3>Open at the edge</h3>
                  <p>
                    The edge software is open source. Any ISP hosting a node,
                    and any provider serving through one, can read exactly what
                    runs at the edge on{' '}
                    <Link href="https://github.com/pfoundation/opencache">
                      GitHub
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">Coverage</span>
              <h2>Local where it counts, covered everywhere</h2>
              <p className="pf-lede">
                OpenCache is live at OpenIX Beirut, where 37 peering networks
                carrying roughly 73% of Lebanon&apos;s traffic reach it with no
                transit in the path. Outside the current footprint, partner CDNs
                keep your audience covered globally, and as the footprint grows,
                more of that delivery moves local.
              </p>
            </Reveal>
          </div>
        </section>

        <section className={clsx('pf-section', styles.band)}>
          <div className="container">
            <Reveal>
              <div className={styles.ispRow}>
                <div className={styles.ispCopy}>
                  <span className="pf-kicker">For ISPs</span>
                  <h2>Host a node, shed your transit</h2>
                  <p className={styles.ispLede}>
                    The model the hyperscaler cache programs proved, made
                    available to everyone at once: a single footprint that
                    offloads transit for every participating provider&apos;s
                    content, with the node provided and operated at no cost to
                    you.
                  </p>
                  <ol className={styles.ispSteps}>
                    <li>
                      You provide rack space, power, an uplink, and a BGP
                      session.
                    </li>
                    <li>
                      We deploy and remotely operate the node: configuration,
                      monitoring, and lifecycle are handled centrally.
                    </li>
                    <li>
                      The node learns your prefixes and serves your subscribers
                      from on-net, cutting your international transit costs.
                    </li>
                  </ol>
                  <Link
                    className={clsx('button', styles.ghostBtnDark)}
                    to="/apply/opencache?as=isp"
                  >
                    Apply as an ISP
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.cta}>
          <div className="container">
            <div className={styles.ctaInner}>
              <h2 className={styles.ctaTitle}>
                Your audience is local. Your delivery can be too.
              </h2>
              <p className={styles.ctaText}>
                Apply as a content provider and start serving from inside the
                network, free of charge, with your origin and your authority
                over your content fully intact.
              </p>
              <div className={styles.ctaActions}>
                <Link
                  className={clsx('button', 'button--lg', 'important-btn')}
                  to="/apply/opencache?as=provider"
                >
                  Start serving
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
