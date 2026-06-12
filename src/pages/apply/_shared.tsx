/**
 * Shared form primitives for the application pages (/apply and
 * /apply/opencache) and the contact page (/contact). The leading
 * underscore keeps the Docusaurus pages
 * plugin from turning this module into a route (its default exclude list
 * contains the glob "**\/_*.{js,jsx,ts,tsx,md,mdx}").
 */
import clsx from 'clsx';
import React, { FunctionComponent, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './apply.module.scss';

export type FieldType =
  | 'text'
  | 'email'
  | 'url'
  | 'textarea'
  | 'select'
  | 'checkboxes';

export type FieldDef = {
  /** Stable state key, also used to build the input id. */
  id: string;
  /** Human readable question label; sent verbatim to the API. */
  label: string;
  type: FieldType;
  required?: boolean;
  /** Options for select and checkboxes fields. */
  options?: readonly string[];
  /** Half-width column on desktop; full width under 996px. */
  half?: boolean;
  /** Persistent helper line under the control. */
  hint?: string;
  /** Compact textarea height (used for short multi-line answers). */
  short?: boolean;
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
  inputMode?: 'numeric';
  /** Extra validation applied to non-empty values on submit. */
  pattern?: { regex: RegExp; message: string };
};

type FieldValues = Record<string, string | string[]>;
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const FALLBACK_ERROR =
  'Something went wrong and the application was not sent. Please try again.';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function inputId(fieldId: string): string {
  return `apply-${fieldId}`;
}

/** Resolves a field's answer to a single string (checkboxes are joined
 *  into one comma separated answer, in option order). */
function fieldAnswer(field: FieldDef, values: FieldValues): string {
  const raw = values[field.id];
  if (Array.isArray(raw)) {
    return (field.options ?? [])
      .filter((option) => raw.includes(option))
      .join(', ');
  }
  return typeof raw === 'string' ? raw : '';
}

function validateField(field: FieldDef, values: FieldValues): string | null {
  const value = fieldAnswer(field, values).trim();
  if (value === '') {
    return field.required ? 'This field is required.' : null;
  }
  if (field.type === 'email' && !EMAIL_REGEX.test(value)) {
    return 'Enter a valid email address.';
  }
  if (field.pattern && !field.pattern.regex.test(value)) {
    return field.pattern.message;
  }
  return null;
}

export const ApplyHero: FunctionComponent<{
  title: string;
  lede: string;
  /** Kicker line above the title; the application pages use the default. */
  kicker?: string;
}> = ({ title, lede, kicker = 'Applications' }) => (
  <header className={styles.hero}>
    <div className={clsx('container', styles.heroInner)}>
      <span className={clsx('pf-kicker', styles.heroKicker)}>{kicker}</span>
      <h1 className={styles.heroTitle}>{title}</h1>
      <p className={styles.heroLede}>{lede}</p>
    </div>
  </header>
);

const FieldControl: FunctionComponent<{
  field: FieldDef;
  values: FieldValues;
  error?: string;
  onChange: (id: string, value: string) => void;
  onToggle: (id: string, option: string) => void;
}> = ({ field, values, error, onChange, onToggle }) => {
  const id = inputId(field.id);
  const hintId = field.hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const label = (
    <>
      {field.label}
      {field.required && (
        <span className={styles.requiredMark} aria-hidden="true">
          {' '}
          *
        </span>
      )}
    </>
  );

  const meta = (
    <>
      {field.hint && (
        <p id={hintId} className={styles.fieldHint}>
          {field.hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.fieldError} role="alert">
          {error}
        </p>
      )}
    </>
  );

  if (field.type === 'checkboxes') {
    const selected = values[field.id];
    const selectedList = Array.isArray(selected) ? selected : [];
    return (
      <fieldset
        id={id}
        tabIndex={-1}
        className={clsx(
          styles.field,
          styles.selectorGroup,
          field.half && styles.fieldHalf
        )}
        aria-describedby={describedBy}
      >
        <legend className={styles.fieldLabel}>{label}</legend>
        <div className={styles.checkGrid}>
          {(field.options ?? []).map((option) => (
            <label key={option} className={styles.checkItem}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedList.includes(option)}
                onChange={() => onToggle(field.id, option)}
              />
              {option}
            </label>
          ))}
        </div>
        {meta}
      </fieldset>
    );
  }

  const value = fieldAnswer(field, values);
  const shared = {
    id,
    value,
    required: field.required || undefined,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => onChange(field.id, event.target.value),
  };

  return (
    <div className={clsx(styles.field, field.half && styles.fieldHalf)}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {label}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          {...shared}
          className={clsx(
            styles.input,
            styles.textarea,
            field.short && styles.textareaShort,
            error && styles.inputError
          )}
          maxLength={field.maxLength ?? 2000}
          placeholder={field.placeholder}
        />
      ) : field.type === 'select' ? (
        <div className={styles.selectWrap}>
          <select
            {...shared}
            className={clsx(
              styles.input,
              styles.select,
              error && styles.inputError
            )}
          >
            <option value="">Select an option</option>
            {(field.options ?? []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input
          {...shared}
          className={clsx(styles.input, error && styles.inputError)}
          type={field.type}
          maxLength={field.maxLength ?? 200}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          inputMode={field.inputMode}
        />
      )}
      {meta}
    </div>
  );
};

export const ApplicationForm: FunctionComponent<{
  /** The "form" value sent to the API for the current selection. */
  formKey: string;
  /** Fields for the current selection, in display order. */
  fields: FieldDef[];
  /** Selector UI (radio cards or segmented control) shown above the fields. */
  selector?: React.ReactNode;
  /** Submit button label; the application pages use the default. */
  submitLabel?: string;
  /** Submit button label while the request is in flight. */
  loadingLabel?: string;
  /** Heading of the success state. */
  successTitle?: string;
  /** Inline error shown when the request fails without a server message. */
  errorFallback?: string;
}> = ({
  formKey,
  fields,
  selector,
  submitLabel = 'Submit application',
  loadingLabel = 'Sending application...',
  successTitle = 'Application received',
  errorFallback = FALLBACK_ERROR,
}) => {
  const { siteConfig } = useDocusaurusContext();
  const apiBaseUrl = siteConfig.customFields.apiBaseUrl as string;

  const [values, setValues] = useState<FieldValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [serverError, setServerError] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  // Validation errors clear as soon as the field changes, so corrected
  // fields do not keep stale error text until the next submit.
  const clearError = (id: string) =>
    setErrors((prev) => {
      if (!(id in prev)) {
        return prev;
      }
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const setValue = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    clearError(id);
  };

  const toggleOption = (id: string, option: string) => {
    setValues((prev) => {
      const current = prev[id];
      const list = Array.isArray(current) ? current : [];
      return {
        ...prev,
        [id]: list.includes(option)
          ? list.filter((item) => item !== option)
          : [...list, option],
      };
    });
    clearError(id);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'loading') {
      return;
    }

    const emailField = fields.find((field) => field.type === 'email');
    const email = emailField ? fieldAnswer(emailField, values).trim() : '';

    // Honeypot: humans never see this field. If it has a value, show the
    // success state without calling the API. The name is deliberately
    // outside the browser autofill vocabulary so address autofill cannot
    // fill it and silently drop a real application.
    if (company.trim() !== '') {
      setSubmittedEmail(email);
      setStatus('success');
      return;
    }

    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      const error = validateField(field, values);
      if (error) {
        nextErrors[field.id] = error;
      }
    }
    setErrors(nextErrors);
    const firstInvalid = fields.find((field) => nextErrors[field.id]);
    if (firstInvalid) {
      document.getElementById(inputId(firstInvalid.id))?.focus();
      return;
    }

    setStatus('loading');
    setServerError('');

    const answers: Record<string, string> = {};
    for (const field of fields) {
      const answer = fieldAnswer(field, values).trim();
      if (answer !== '') {
        answers[field.label] = answer;
      }
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formKey, email, fields: answers }),
      });

      if (response.ok) {
        setSubmittedEmail(email);
        setStatus('success');
        return;
      }

      let message = errorFallback;
      try {
        const body = await response.json();
        if (body && typeof body.error === 'string' && body.error) {
          message = body.error;
        }
      } catch {
        // Error body was not JSON, keep the fallback message.
      }
      setServerError(message);
      setStatus('error');
    } catch {
      setServerError(errorFallback);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.formCard}>
        <div className={styles.success} role="status">
          <div className={styles.successIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h2
            className={styles.successTitle}
            tabIndex={-1}
            ref={(node) => node?.focus()}
          >
            {successTitle}
          </h2>
          <p className={styles.successText}>
            We will get back to you at <strong>{submittedEmail}</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.formCard} onSubmit={handleSubmit} noValidate>
      {selector}

      <div className={styles.fieldGrid}>
        {fields.map((field) => (
          <FieldControl
            key={field.id}
            field={field}
            values={values}
            error={errors[field.id]}
            onChange={setValue}
            onToggle={toggleOption}
          />
        ))}
      </div>

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
        className={styles.submitBtn}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? loadingLabel : submitLabel}
      </button>

      {status === 'error' && (
        <div className={styles.errorBox} role="alert">
          {serverError}
        </div>
      )}
    </form>
  );
};
