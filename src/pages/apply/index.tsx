import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import Layout from '@theme/Layout';

import { ApplicationForm, ApplyHero, FieldDef } from './_shared';
import styles from './apply.module.scss';

type ProgramKey = 'mediaguard' | 'citizenmesh' | 'resilientnet';

const PROGRAMS: Array<{
  key: ProgramKey;
  name: string;
  description: string;
}> = [
  {
    key: 'mediaguard',
    name: 'MediaGuard',
    description: 'Tailored support for media organizations worldwide.',
  },
  {
    key: 'citizenmesh',
    name: 'CitizenMesh',
    description:
      'Community-built internet for schools, libraries, and public spaces in Lebanon.',
  },
  {
    key: 'resilientnet',
    name: 'ResilientNet',
    description:
      'Resilient connectivity for healthcare, emergency services, and utilities in Lebanon.',
  },
];

const PROGRAM_KEYS = PROGRAMS.map((program) => program.key);

const SHARED_TOP_FIELDS: FieldDef[] = [
  {
    id: 'organization',
    label: 'Organization or institution name',
    type: 'text',
    required: true,
    half: true,
    autoComplete: 'organization',
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
    id: 'website',
    label: 'Website',
    type: 'url',
    half: true,
    placeholder: 'https://',
    maxLength: 500,
    autoComplete: 'url',
  },
  {
    id: 'country',
    label: 'Country or location',
    type: 'text',
    required: true,
    half: true,
    autoComplete: 'country-name',
  },
];

const NEEDS_FIELD: FieldDef = {
  id: 'needs',
  label: 'Tell us about your needs',
  type: 'textarea',
  required: true,
  maxLength: 2000,
};

const PROGRAM_FIELDS: Record<ProgramKey, FieldDef[]> = {
  mediaguard: [
    {
      id: 'mg-org-type',
      label: 'Organization type',
      type: 'select',
      half: true,
      options: ['Broadcaster', 'News organization', 'Online media', 'Other'],
    },
    {
      id: 'mg-services',
      label: 'Services needed',
      type: 'checkboxes',
      options: [
        'Backhaul support',
        'Downlinking',
        'Digital streaming',
        'Content distribution',
      ],
    },
  ],
  citizenmesh: [
    {
      id: 'cm-type',
      label: 'Community or institution type',
      type: 'select',
      half: true,
      options: ['School', 'Library', 'Public space', 'Municipality', 'Other'],
    },
    {
      id: 'cm-location',
      label: 'Location in Lebanon',
      type: 'text',
      required: true,
    },
  ],
  resilientnet: [
    {
      id: 'rn-type',
      label: 'Facility type',
      type: 'select',
      half: true,
      options: ['Healthcare', 'Emergency services', 'Utility', 'Other'],
    },
    {
      id: 'rn-location',
      label: 'Location in Lebanon',
      type: 'text',
      required: true,
    },
    {
      id: 'rn-critical',
      label: 'Why is this installation critical',
      type: 'textarea',
      short: true,
      maxLength: 2000,
    },
  ],
};

export default function Apply(): JSX.Element {
  const location = useLocation();
  const [program, setProgram] = useState<ProgramKey>('mediaguard');

  // Preselection via ?program=... is applied after hydration so the
  // statically rendered markup stays consistent.
  useEffect(() => {
    const requested = new URLSearchParams(location.search).get('program');
    if (requested && (PROGRAM_KEYS as string[]).includes(requested)) {
      setProgram(requested as ProgramKey);
    }
  }, [location.search]);

  const fields = [
    ...SHARED_TOP_FIELDS,
    ...PROGRAM_FIELDS[program],
    NEEDS_FIELD,
  ];

  const selector = (
    <fieldset className={styles.selectorGroup}>
      <legend className={styles.selectorLegend}>Program</legend>
      <div className={styles.programCards}>
        {PROGRAMS.map((item) => (
          <label
            key={item.key}
            className={clsx(
              styles.programCard,
              program === item.key && styles.programCardActive
            )}
          >
            <input
              type="radio"
              name="program"
              value={item.key}
              className={styles.programRadio}
              checked={program === item.key}
              onChange={() => setProgram(item.key)}
            />
            <span className={styles.programName}>{item.name}</span>
            <span className={styles.programDesc}>{item.description}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <Layout
      title="Apply to a program"
      description="Apply to a P Foundation program: MediaGuard, CitizenMesh, or ResilientNet. Applications go straight to our team and get a reply by email."
    >
      <ApplyHero
        title="Apply to a program"
        lede="Applications go straight to our team and get a reply by email."
      />

      <main className={styles.formSection}>
        <div className="container">
          <div className={styles.formWrap}>
            <ApplicationForm
              formKey={program}
              fields={fields}
              selector={selector}
            />
            <p className={styles.crossLink}>
              Joining OpenCache as an ISP or a content provider?{' '}
              <Link to="/apply/opencache">Apply for OpenCache</Link>.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
