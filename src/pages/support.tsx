import React from 'react';
import Layout from '@theme/Layout';

import { ApplicationForm, ApplyHero, FieldDef } from './apply/_shared';
import styles from './apply/apply.module.scss';

const FIELDS: FieldDef[] = [
  {
    id: 'console',
    label: 'Console account',
    type: 'email',
    required: true,
    half: true,
    maxLength: 254,
    autoComplete: 'email',
  },
  {
    id: 'severity',
    label: 'Severity',
    type: 'select',
    half: true,
    options: ['Low', 'Normal', 'High', 'Urgent'],
    defaultValue: 'Normal',
  },
  {
    id: 'subject',
    label: 'Subject',
    type: 'text',
    required: true,
    maxLength: 200,
  },
  {
    id: 'message',
    label: 'Describe the issue',
    type: 'textarea',
    required: true,
    maxLength: 2000,
    hint: 'Include what you expected, what happened, and any affected resources or IDs.',
  },
];

export default function Support(): JSX.Element {
  return (
    <Layout
      title="Support"
      description="Partner support for P Foundation. Open a request tied to your console account and our team follows up by email."
    >
      <ApplyHero
        kicker="Support"
        title="Partner support"
        lede="Run into an issue? Open a request and our support team will follow up with you shortly."
      />

      <main className={styles.formSection}>
        <div className="container">
          <div className={styles.formWrap}>
            <ApplicationForm
              formKey="support"
              fields={FIELDS}
              submitLabel="Open support request"
              loadingLabel="Sending request..."
              successTitle="Request received"
              successMessage={(email) => (
                <>
                  We will follow up at <strong>{email}</strong> about your
                  request.
                </>
              )}
              errorFallback="Something went wrong and the request was not sent. Please try again."
            />

            <aside className={styles.directCard}>
              <h2 className={styles.directTitle}>Before you reach out</h2>
              <dl className={styles.directList}>
                <div className={styles.directRow}>
                  <dt className={styles.directLabel}>Console account</dt>
                  <dd className={styles.directValue}>
                    Use the email tied to your console account. It helps us find
                    your resources faster.
                  </dd>
                </div>
                <div className={styles.directRow}>
                  <dt className={styles.directLabel}>Severity</dt>
                  <dd className={styles.directValue}>
                    Reserve Urgent for outages affecting live service.
                  </dd>
                </div>
                <div className={styles.directRow}>
                  <dt className={styles.directLabel}>Email</dt>
                  <dd className={styles.directValue}>
                    <a href="mailto:support@p.foundation">
                      support@p.foundation
                    </a>
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </main>
    </Layout>
  );
}
