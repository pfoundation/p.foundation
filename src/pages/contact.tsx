import React from 'react';
import Layout from '@theme/Layout';

import { ApplicationForm, ApplyHero, FieldDef } from './apply/_shared';
import styles from './apply/apply.module.scss';

const FIELDS: FieldDef[] = [
  {
    id: 'name',
    label: 'Name',
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
    id: 'organization',
    label: 'Organization',
    type: 'text',
    half: true,
    autoComplete: 'organization',
  },
  {
    id: 'topic',
    label: 'Topic',
    type: 'select',
    half: true,
    options: [
      'General',
      'Donations',
      'Programs',
      'Products',
      'OpenIX',
      'Press',
    ],
  },
  {
    id: 'message',
    label: 'Message',
    type: 'textarea',
    required: true,
    maxLength: 2000,
  },
];

export default function Contact(): JSX.Element {
  return (
    <Layout
      title="Contact"
      description="Contact P Foundation with questions, partnerships, press inquiries, or anything else. Messages go straight to our team and get a reply by email."
    >
      <ApplyHero
        kicker="Contact"
        title="Contact us"
        lede="Questions, partnerships, press, or anything else: messages go straight to our team and get a reply by email."
      />

      <main className={styles.formSection}>
        <div className="container">
          <div className={styles.formWrap}>
            <ApplicationForm
              formKey="contact"
              fields={FIELDS}
              submitLabel="Send message"
              loadingLabel="Sending message..."
              successTitle="Message received"
              errorFallback="Something went wrong and the message was not sent. Please try again."
            />

            <aside className={styles.directCard}>
              <h2 className={styles.directTitle}>Other ways to reach us</h2>
              <dl className={styles.directList}>
                <div className={styles.directRow}>
                  <dt className={styles.directLabel}>Postal Address</dt>
                  <dd className={styles.directValue}>
                    P Foundation{' '}
                    <dd className={styles.directValue}> 700 12th St NW</dd>{' '}
                    <dd className={styles.directValue}>Ste 700</dd>
                    <dd className={styles.directValue}>Washington, DC 20005</dd>
                    <dd className={styles.directValue}>U.S.A</dd>
                  </dd>
                </div>
                <div className={styles.directRow}>
                  <dt className={styles.directLabel}>Tel</dt>
                  <dd className={styles.directValue}>+1 (202) 351-5555</dd>
                </div>
                <div className={styles.directRow}>
                  <dt className={styles.directLabel}>Email</dt>
                  <dd className={styles.directValue}>
                    <a href="mailto:contact@p.foundation">
                      contact@p.foundation
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
