/**
 * Cloudflare Turnstile bot check for the site's forms.
 *
 * Nothing loads or renders until the visitor submits a form. On submit the
 * form calls getToken(), which loads the Turnstile script (once per page),
 * renders an "interaction-only" widget into the slot, and resolves with a
 * single-use token. Most visitors pass invisibly, so the token arrives in a
 * second or two and the submission continues on its own. Only when
 * Cloudflare wants an interactive check does the widget appear; the form
 * then continues as soon as the visitor completes it.
 *
 * When no site key is configured (customFields.turnstileSiteKey, set from
 * PF_TURNSTILE_SITE_KEY at build time) getToken() resolves with an empty
 * string and the check is skipped; the worker only enforces tokens when its
 * TURNSTILE_SECRET_KEY secret is set.
 */
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './Turnstile.module.scss';

const SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

const LOAD_ERROR =
  'The security check could not load. Check your connection or allow challenges.cloudflare.com in your content blocker, then try again.';
const FAILED_ERROR = 'The security check failed. Please try again.';
const TIMEOUT_ERROR = 'The security check timed out. Please try again.';
const UNSUPPORTED_ERROR =
  'Your browser does not support our security check. Please update it or try another browser.';

type TurnstileOptions = {
  sitekey: string;
  action: string;
  appearance: 'always' | 'execute' | 'interaction-only';
  size: 'normal' | 'flexible' | 'compact';
  retry: 'auto' | 'never';
  'refresh-expired': 'auto' | 'manual' | 'never';
  'response-field': boolean;
  callback: (token: string) => void;
  'error-callback': (code: string) => boolean | void;
  'timeout-callback': () => void;
  'unsupported-callback': () => void;
  'before-interactive-callback': () => void;
  'after-interactive-callback': () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string | null;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** Raised by getToken(); its message is safe to show to the visitor. */
export class TurnstileError extends Error {}

let scriptPromise: Promise<TurnstileApi> | null = null;

/** Load the Turnstile script once per page; a failed load can be retried. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }
  if (!scriptPromise) {
    scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      script.onload = () => {
        if (window.turnstile) {
          resolve(window.turnstile);
        } else {
          scriptPromise = null;
          reject(new Error('Turnstile script loaded without its API'));
        }
      };
      script.onerror = () => {
        scriptPromise = null;
        script.remove();
        reject(new Error('Turnstile script failed to load'));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

/**
 * @param action Turnstile action name, checked by the worker so a token is
 *   only accepted by the endpoint it was issued for.
 * @returns getToken() to call on submit, and the slot element to render
 *   near the submit button (empty unless an interactive check is needed).
 */
export function useTurnstile(action: 'apply' | 'newsletter' | 'donate'): {
  getToken: () => Promise<string>;
  slot: React.ReactElement;
} {
  const { siteConfig } = useDocusaurusContext();
  const siteKey = (siteConfig.customFields.turnstileSiteKey as string) || '';

  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [interactive, setInteractive] = useState(false);

  const removeWidget = useCallback(() => {
    const widgetId = widgetIdRef.current;
    widgetIdRef.current = null;
    setInteractive(false);
    if (widgetId && window.turnstile) {
      try {
        window.turnstile.remove(widgetId);
      } catch {
        // Already gone; nothing to clean up.
      }
    }
  }, []);

  useEffect(() => removeWidget, [removeWidget]);

  const getToken = useCallback(async (): Promise<string> => {
    if (!siteKey) {
      return '';
    }
    // Tokens are single use, so every submission gets a fresh widget.
    removeWidget();

    let api: TurnstileApi;
    try {
      api = await loadTurnstile();
    } catch {
      throw new TurnstileError(LOAD_ERROR);
    }
    const container = containerRef.current;
    if (!container) {
      throw new TurnstileError(LOAD_ERROR);
    }

    return new Promise<string>((resolve, reject) => {
      let settled = false;
      const finish = (token: string | null, message?: string) => {
        if (settled) {
          return;
        }
        settled = true;
        // Remove outside Turnstile's own callback stack.
        window.setTimeout(removeWidget, 0);
        if (token) {
          resolve(token);
        } else {
          reject(new TurnstileError(message ?? FAILED_ERROR));
        }
      };

      try {
        widgetIdRef.current = api.render(container, {
          sitekey: siteKey,
          action,
          // Invisible unless Cloudflare decides the visitor must interact.
          appearance: 'interaction-only',
          size: 'flexible',
          retry: 'never',
          'refresh-expired': 'manual',
          'response-field': false,
          callback: (token) => finish(token),
          'error-callback': () => {
            finish(null, FAILED_ERROR);
            return true;
          },
          'timeout-callback': () => finish(null, TIMEOUT_ERROR),
          'unsupported-callback': () => finish(null, UNSUPPORTED_ERROR),
          'before-interactive-callback': () => setInteractive(true),
          'after-interactive-callback': () => setInteractive(false),
        });
      } catch {
        finish(null, LOAD_ERROR);
      }
    });
  }, [siteKey, action, removeWidget]);

  const slot = (
    <div className={clsx(styles.slot, interactive && styles.slotActive)}>
      <p className={styles.prompt} role="status">
        {interactive
          ? 'One more step: complete the security check below to continue.'
          : ''}
      </p>
      <div ref={containerRef} />
    </div>
  );

  return { getToken, slot };
}
