import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import Layout from '@theme/Layout';

import { ApplicationForm, ApplyHero, FieldDef } from './_shared';
import styles from './apply.module.scss';

type RoleKey = 'isp' | 'provider';

const FORM_KEYS: Record<RoleKey, string> = {
  isp: 'opencache-isp',
  provider: 'opencache-provider',
};

const CONTACT_FIELDS: FieldDef[] = [
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
    hint: 'We will reply at this address, and it becomes your username for PF Console once your application is approved.',
  },
];

const NOTES_FIELD: FieldDef = {
  id: 'notes',
  label: 'Anything we should know',
  type: 'textarea',
  short: true,
  maxLength: 2000,
};

const ROLE_FIELDS: Record<RoleKey, FieldDef[]> = {
  isp: [
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
      id: 'isp-location',
      label: 'Country and city',
      type: 'text',
      required: true,
      half: true,
    },
    {
      id: 'uplink',
      label: 'Uplink capacity',
      type: 'text',
      half: true,
      placeholder: 'e.g. 2 x 10 Gbps',
    },
    ...CONTACT_FIELDS,
    NOTES_FIELD,
  ],
  provider: [
    {
      id: 'organization',
      label: 'Organization name',
      type: 'text',
      required: true,
      autoComplete: 'organization',
    },
    {
      id: 'domains',
      label: 'Primary domains',
      type: 'textarea',
      required: true,
      short: true,
      maxLength: 2000,
      hint: 'The domains you serve content from. One per line is fine.',
    },
    {
      id: 'regions',
      label: 'Audience regions',
      type: 'text',
      placeholder: 'e.g. Lebanon and the wider Middle East',
    },
    ...CONTACT_FIELDS,
    NOTES_FIELD,
  ],
};

export default function ApplyOpenCache(): JSX.Element {
  const location = useLocation();
  const [role, setRole] = useState<RoleKey>('isp');

  // Preselection via ?as=isp|provider is applied after hydration so the
  // statically rendered markup stays consistent.
  useEffect(() => {
    const requested = new URLSearchParams(location.search).get('as');
    if (requested === 'isp' || requested === 'provider') {
      setRole(requested);
    }
  }, [location.search]);

  const selector = (
    <div className={styles.segment} role="group" aria-label="Apply as">
      <button
        type="button"
        className={clsx(
          styles.segmentBtn,
          role === 'isp' && styles.segmentBtnActive
        )}
        aria-pressed={role === 'isp'}
        onClick={() => setRole('isp')}
      >
        As an ISP
      </button>
      <button
        type="button"
        className={clsx(
          styles.segmentBtn,
          role === 'provider' && styles.segmentBtnActive
        )}
        aria-pressed={role === 'provider'}
        onClick={() => setRole('provider')}
      >
        As a content provider
      </button>
    </div>
  );

  return (
    <Layout
      title="Apply for OpenCache"
      description="Apply to join OpenCache, P Foundation's neutral shared caching network, as an ISP that hosts a cache node or as a content provider that serves through the network."
    >
      <ApplyHero
        title="Apply for OpenCache"
        lede="OpenCache is our neutral shared caching network. ISPs host nodes by providing space, power, uplink, and a BGP session, and delivery through the network is open to any content provider. Tell us who you are and we will reply by email."
      />

      <main className={styles.formSection}>
        <div className="container">
          <div className={styles.formWrap}>
            <ApplicationForm
              formKey={FORM_KEYS[role]}
              fields={ROLE_FIELDS[role]}
              selector={selector}
            />
            <p className={styles.crossLink}>
              Looking for our programs instead?{' '}
              <Link to="/apply">Apply to a program</Link>.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
