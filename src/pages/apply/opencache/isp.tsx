import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import { ApplicationForm, ApplyHero, FieldDef } from '../_shared';
import styles from '../apply.module.scss';

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

export default function ApplyOpenCacheISP(): JSX.Element {
  return (
    <Layout
      title="Host an OpenCache node"
      description="Apply to host an OpenCache node on your network. You provide rack space, power, an uplink, and a BGP session; P Foundation deploys and operates the node and serves your subscribers from on-net, cutting your international transit costs."
    >
      <ApplyHero
        title="Host an OpenCache node"
        lede="Host a node and shed your transit. You provide rack space, power, an uplink, and a BGP session; we deploy and remotely operate the node and serve your subscribers from on-net. Tell us about your network and we will reply by email."
      />

      <main className={styles.formSection}>
        <div className="container">
          <div className={styles.formWrap}>
            <ApplicationForm formKey={FORM_KEY} fields={FIELDS} />
            <p className={styles.crossLink}>
              Want to serve content through OpenCache instead?{' '}
              <Link to="/apply/opencache">Create an account</Link>.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
