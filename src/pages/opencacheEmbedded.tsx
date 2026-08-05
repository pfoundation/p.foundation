import clsx from 'clsx';
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import Link from '@docusaurus/Link';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import Layout from '@theme/Layout';

import { ApplicationForm, FieldDef } from './apply/_shared';
import styles from './opencacheEmbedded.module.scss';

const title = 'Embedded OpenCache PoP';
const description =
  'Host an Embedded OpenCache PoP inside your network. P Foundation ships, deploys, and operates the PoP; it answers your subscribers from on-net instead of over your international transit. Networks that sustain more than 5 Gbps of peak OpenCache traffic qualify.';

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
/* Hero figure: where a request ends up                               */
/* ------------------------------------------------------------------ */

const OffloadPanel: FunctionComponent = () => (
  <figure className={styles.panel}>
    <figcaption className={styles.panelTitle}>
      Where an OpenCache request is served from
    </figcaption>

    <div className={styles.panelRow}>
      <span className={styles.panelLabel}>Without a PoP in your network</span>
      <span className={styles.barTrack} aria-hidden="true">
        <span
          className={clsx(styles.barSeg, styles.barTransit)}
          style={{ width: '100%' }}
        />
      </span>
      <span className={styles.panelMeta}>
        Every request crosses your international transit.
      </span>
    </div>

    <div className={styles.panelRow}>
      <span className={styles.panelLabel}>With an Embedded OpenCache PoP</span>
      <span className={styles.barTrack} aria-hidden="true">
        <span
          className={clsx(styles.barSeg, styles.barLocal)}
          style={{ width: '97%' }}
        />
        <span
          className={clsx(styles.barSeg, styles.barTransit)}
          style={{ width: '3%' }}
        />
      </span>
      <span className={styles.panelMeta}>
        <strong>97%</strong> answered inside your network. The rest falls
        through.
      </span>
    </div>

    <p className={styles.panelNote}>
      On-demand delivery, measured across three months of production traffic.
      Live content lands between 80% and 85%.
    </p>
  </figure>
);

/* ------------------------------------------------------------------ */
/* Anatomy of a PoP: what is in the unit, what it plugs into           */
/* ------------------------------------------------------------------ */

const LAYERS: { label: string; note: string }[] = [
  {
    label: 'TLS termination',
    note: 'certificates live and terminate in the unit, never on host hardware',
  },
  {
    label: 'HTTP/1.1, HTTP/2, HTTP/3 over QUIC',
    note: 'every client negotiates the best protocol it speaks',
  },
  {
    label: 'Cache store',
    note: 'filled from the exchange, served to your subscribers at line rate',
  },
  {
    label: 'Health agent',
    note: 'scores the unit for the control plane every 15 seconds',
  },
];

type PortDir = 'both' | 'in' | 'updown';

const PORTS: { dir: PortDir; label: string; note: string }[] = [
  {
    dir: 'both',
    label: 'Uplink to your core',
    note: 'requests in, cached objects out',
  },
  {
    dir: 'in',
    label: 'BGP session, listen-only',
    note: 'your prefixes in, nothing announced back',
  },
  {
    dir: 'updown',
    label: 'Control plane',
    note: 'config down, telemetry up',
  },
];

const PortIcon: FunctionComponent<{ dir: PortDir }> = ({ dir }) => (
  <svg
    viewBox="0 0 16 16"
    width={16}
    height={16}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {dir === 'updown' ? (
      <>
        <path d="M8 2.5v11" />
        <path d="m5 5.5 3-3 3 3" />
        <path d="m5 10.5 3 3 3-3" />
      </>
    ) : (
      <>
        <path d="M2.5 8h11" />
        <path d="m10.5 5 3 3-3 3" />
        {dir === 'both' && <path d="m5.5 5-3 3 3 3" />}
      </>
    )}
  </svg>
);

const PoPUnit: FunctionComponent = () => (
  <div className={styles.unit}>
    <div className={styles.unitHead}>
      <span className={styles.unitName}>Embedded OpenCache PoP</span>
      <span className={styles.unitWhere}>in your rack</span>
    </div>
    <ul className={styles.unitLayers}>
      {LAYERS.map((layer) => (
        <li key={layer.label} className={styles.unitLayer}>
          <span className={styles.unitLayerLabel}>{layer.label}</span>
          <span className={styles.unitLayerNote}>{layer.note}</span>
        </li>
      ))}
    </ul>
    <p className={styles.unitPortsTitle}>What it plugs into</p>
    <ul className={styles.unitPorts}>
      {PORTS.map((port) => (
        <li key={port.label} className={styles.unitPort}>
          <span className={styles.unitPortIcon}>
            <PortIcon dir={port.dir} />
          </span>
          <span className={styles.unitPortLabel}>{port.label}</span>
          <span className={styles.unitPortNote}>{port.note}</span>
        </li>
      ))}
    </ul>
  </div>
);

/* ------------------------------------------------------------------ */
/* What each side brings                                              */
/* ------------------------------------------------------------------ */

const YOU_PROVIDE: string[] = [
  'Rack space with dual power feeds, in a facility that already terminates subscriber traffic.',
  'An uplink into your core with headroom above your peak OpenCache demand.',
  'IPv4 and IPv6 addressing for the PoP, plus a listen-only BGP session carrying the prefixes it should answer for.',
  'Remote hands for the install and for any hardware replacement.',
  'A NOC contact for maintenance windows and capacity planning.',
];

const WE_PROVIDE: string[] = [
  'Hardware sized to the peak demand confirmed at your site survey, shipped to your facility.',
  'Deployment, configuration, and remote operation: the PoP pulls declarative config, validates it, and reloads without dropping traffic.',
  'Cache rules and traffic policy set centrally and applied identically at every PoP in the fleet.',
  'Content from every provider serving through OpenCache on one footprint, growing as providers join.',
  'Delivery reporting in PF Console: what the PoP served, and what it kept off your transit.',
];

/* ------------------------------------------------------------------ */
/* Request path                                                       */
/* ------------------------------------------------------------------ */

interface PathStop {
  label: string;
  note: string;
  tone: string;
}

const PATH: PathStop[] = [
  {
    label: 'Your subscriber',
    note: 'on your access network',
    tone: 'toneStart',
  },
  {
    label: 'Embedded OpenCache PoP',
    note: '97 of every 100 on-demand requests stop here, inside your network',
    tone: 'toneLocal',
  },
  {
    label: 'PoP at local exchange',
    note: 'a local hop over peering, where local exchange has one',
    tone: 'toneExchange',
  },
  {
    label: 'Provider origin',
    note: 'the only stop that touches your international transit',
    tone: 'toneOrigin',
  },
];

/** Connector labels between the stops, in order. */
const HOPS = ['request', 'on a miss', 'on a second miss'];

const RequestPath: FunctionComponent = () => (
  <div className={styles.path}>
    <div className={styles.pathRow}>
      {PATH.map((stop, index) => (
        <React.Fragment key={stop.label}>
          {index > 0 && (
            <div className={styles.hop}>
              <span
                className={clsx(
                  styles.hopArrow,
                  index === PATH.length - 1 && styles.hopArrowTransit
                )}
                aria-hidden="true"
              />
              <span className={styles.hopLabel}>{HOPS[index - 1]}</span>
            </div>
          )}
          <div className={clsx(styles.pathStop, styles[stop.tone])}>
            <span className={styles.pathLabel}>{stop.label}</span>
            <span className={styles.pathNote}>{stop.note}</span>
          </div>
        </React.Fragment>
      ))}
    </div>

    {/* The exchange tier is optional: this lane brackets from the embedded PoP
        past it and up into the origin. It becomes a plain note when the row
        stacks into a column. */}
    <p className={styles.bypass}>
      <span className={styles.bypassBracket} aria-hidden="true" />
      <span className={styles.bypassLabel}>
        Where your exchange has no PoP, a miss goes straight to the origin
      </span>
    </p>
  </div>
);

/* ------------------------------------------------------------------ */
/* Copy blocks                                                        */
/* ------------------------------------------------------------------ */

interface Titled {
  title: string;
  body: string;
}

const CALLOUTS: Titled[] = [
  {
    title: 'It answers only for your prefixes',
    body: 'The listen-only session tells the PoP whose subscribers it is serving. It announces nothing back to you, and it changes nothing about your routing policy.',
  },
  {
    title: 'Nothing for your team to run',
    body: 'Configuration, cache rules, traffic policy, monitoring, and lifecycle stay with the foundation, applied identically at every PoP in the fleet.',
  },
  {
    title: 'Not peering, not transit',
    body: 'A PoP is a delivery footprint in your rack. It is not a session you negotiate with us, and it is not bandwidth you buy.',
  },
];

const REQUIREMENTS: string[] = [
  'A public ASN and a BGP-capable network, with the prefixes you want answered carried on a listen-only session.',
  'A facility close to your subscribers, with the space, power, and uplink headroom the site survey confirms.',
  'Remote hands available for the install and for hardware replacement.',
  'No filtering, rewriting, reprioritizing, or selective degradation of what the PoP serves: the fleet answers identically everywhere.',
];

const STEPS: Titled[] = [
  {
    title: 'Apply and qualify',
    body: 'Tell us your ASN, where the PoP would sit, and the OpenCache traffic your subscribers pull today. We check it against the bar and against how your network is built.',
  },
  {
    title: 'Design and agreement',
    body: 'We settle where the PoP sits, how it attaches to your core, and how many the site needs. A hosting agreement covers the hardware, access, power, and the commitments on both sides.',
  },
  {
    title: 'Survey and install',
    body: 'Rack, power, ports, addressing, and cross connects are confirmed before anything ships. Your remote hands rack and cable it, we configure it centrally, and traffic moves once it reports healthy.',
  },
  {
    title: 'Operation',
    body: 'Monitoring, cache rules, and lifecycle stay with us. Your NOC gets the delivery picture in PF Console, and we coordinate maintenance with it.',
  },
];

/* ------------------------------------------------------------------ */
/* Application form                                                   */
/* ------------------------------------------------------------------ */

const FORM_KEY = 'opencache-isp';

const FIELDS: FieldDef[] = [
  {
    id: 'network',
    label: 'Network name',
    type: 'text',
    required: true,
    half: true,
    autoComplete: 'organization',
  },
  {
    id: 'asn',
    label: 'ASN',
    type: 'text',
    required: true,
    half: true,
    maxLength: 10,
    inputMode: 'numeric',
    placeholder: 'e.g. 399728',
    pattern: {
      regex: /^[0-9]{1,10}$/,
      message: 'Enter the AS number as digits only.',
    },
  },
  {
    id: 'oc-traffic',
    label: 'Peak OpenCache traffic',
    type: 'select',
    required: true,
    half: true,
    options: [
      'Under 5 Gbps',
      '5 to 10 Gbps',
      '10 to 25 Gbps',
      'More than 25 Gbps',
      'Not measured yet',
    ],
    hint: 'Toward your subscribers, at peak. PF Console reports it if you already reach an OpenCache PoP over peering.',
  },
  {
    id: 'peering',
    label: 'Exchanges you peer at',
    type: 'text',
    half: true,
    maxLength: 500,
    placeholder: 'e.g. OpenIX Beirut',
  },
  {
    id: 'isp-location',
    label: 'Country and city',
    type: 'text',
    required: true,
    half: true,
  },
  {
    id: 'facility',
    label: 'Facility for the PoP',
    type: 'text',
    half: true,
    placeholder: 'e.g. our primary core site',
  },
  {
    id: 'uplink',
    label: 'Uplink capacity into your core',
    type: 'text',
    half: true,
    placeholder: 'e.g. 2 x 10 Gbps',
  },
  {
    id: 'peeringdb',
    label: 'PeeringDB record',
    type: 'text',
    half: true,
    maxLength: 500,
    placeholder: 'peeringdb.com/net/...',
  },
  {
    id: 'contact',
    label: 'Contact name',
    type: 'text',
    required: true,
    half: true,
    autoComplete: 'name',
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    half: true,
    maxLength: 254,
    autoComplete: 'email',
  },
  {
    id: 'notes',
    label: 'Anything we should know',
    type: 'textarea',
    short: true,
    maxLength: 2000,
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function EmbeddedOpenCachePoP(): JSX.Element {
  // The in-page links to the form target #apply on a plain section element,
  // which the broken-anchor checker only knows about once it is registered.
  useBrokenLinks().collectAnchor('apply');

  return (
    <Layout title={title} description={description}>
      <header className={styles.hero}>
        <div className={clsx('container', styles.heroInner)}>
          <div className={styles.heroCopy}>
            <span className={clsx('pf-kicker', styles.heroKicker)}>
              Embedded OpenCache PoP
            </span>
            <h1 className={styles.heroTitle}>
              Put OpenCache{' '}
              <span className={styles.heroAccent}>inside your network</span>
            </h1>
            <p className={styles.heroLede}>
              An Embedded OpenCache PoP is cache hardware that P Foundation
              deploys and operates inside your network. You provide rack space,
              power, an uplink, and a BGP session; everything running on the PoP
              stays with us.
            </p>

            <div className={styles.heroActions}>
              <Link
                className={clsx('button', 'button--lg', 'important-btn')}
                to="#apply"
              >
                Apply for a PoP
              </Link>
              <Link
                className={clsx('button', 'button--lg', styles.ghostBtn)}
                to="/opencache"
              >
                More on OpenCache
              </Link>
            </div>
          </div>
          <OffloadPanel />
        </div>
      </header>

      <main>
        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">What it is</span>
              <h2>A cache PoP in your facility, operated by the foundation</h2>
              <p className="pf-lede">
                Every OpenCache PoP runs the same platform under one control
                plane; what an embedded PoP changes is where it sits.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className={styles.anatomy}>
                <PoPUnit />
                <ul className={styles.calloutList}>
                  {CALLOUTS.map((item) => (
                    <li key={item.title} className={styles.callout}>
                      <h3 className={styles.calloutTitle}>{item.title}</h3>
                      <p className={styles.calloutBody}>{item.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className={styles.splitGrid}>
                <div className={clsx('card', styles.splitCard)}>
                  <span className={styles.splitWho}>What you provide</span>
                  <ul className={styles.splitList}>
                    {YOU_PROVIDE.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div
                  className={clsx(
                    'card',
                    styles.splitCard,
                    styles.splitCardAlt
                  )}
                >
                  <span className={styles.splitWho}>What we provide</span>
                  <ul className={styles.splitList}>
                    {WE_PROVIDE.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={clsx('pf-section', styles.band)}>
          <div className="container">
            <Reveal>
              <span className="pf-kicker">Qualification</span>
              <h2>The bar is 5 Gbps of peak OpenCache traffic</h2>
            </Reveal>
            <Reveal delay={100}>
              <div className={styles.qualRow}>
                <div className={styles.qualFigure}>
                  <span className={styles.qualFigurePrefix}>more than</span>
                  <span className={styles.qualFigureValue}>5 Gbps</span>
                  <span className={styles.qualFigureLabel}>
                    of peak OpenCache traffic toward your subscribers,
                    sustained, week after week
                  </span>
                </div>
                <div className={styles.qualCopy}>
                  <p>
                    An embedded PoP is warranted once your network sustains more
                    than 5 Gbps of peak OpenCache traffic toward your
                    subscribers. We measure it on what you already pull: from
                    the OpenCache PoP at your exchange if you peer with one, or
                    over your transit if you do not. One busy evening is not the
                    test; the number has to hold at peak. Networks that clear it
                    comfortably run more than one PoP, clustered in a facility
                    for capacity or distributed across regions.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <h3 className={styles.reqTitle}>Alongside the traffic bar</h3>
              <ul className={styles.reqList}>
                {REQUIREMENTS.map((item) => (
                  <li key={item} className={styles.reqItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="pf-section">
          <div className="container">
            <Reveal>
              <span className="pf-kicker">Request path</span>
              <h2>Only the second miss uses your transit</h2>
            </Reveal>
            <Reveal delay={100}>
              <RequestPath />
            </Reveal>
          </div>
        </section>

        <section className={clsx('pf-section', styles.band)}>
          <div className="container">
            <Reveal>
              <span className="pf-kicker">Process</span>
              <h2>From application to serving</h2>
            </Reveal>
            <Reveal delay={100}>
              <ol className={styles.stepsGrid}>
                {STEPS.map((step, index) => (
                  <li key={step.title} className={styles.step}>
                    <span className={styles.stepNum} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepBody}>{step.body}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        <section className={clsx('pf-section', styles.applySection)} id="apply">
          <div className="container">
            <div className={styles.formHead}>
              <span className="pf-kicker">Apply</span>
              <h2>Apply for an Embedded OpenCache PoP</h2>
              <p className="pf-lede">
                Tell us about your network. Applications reach our team
                directly, and we reply by email.
              </p>
            </div>
            <div className={styles.formWrap}>
              <ApplicationForm
                formKey={FORM_KEY}
                fields={FIELDS}
                successMessage={(email) => (
                  <>
                    We will measure your network against the 5 Gbps bar, look at
                    how it is built, and reply at <strong>{email}</strong>.
                  </>
                )}
              />
              <p className={styles.crossLink}>
                Serving content rather than hosting a PoP?{' '}
                <Link to="/apply/opencache">Create an OpenCache account</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
