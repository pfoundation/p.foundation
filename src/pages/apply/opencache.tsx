import React, { useEffect } from 'react';
import Link from '@docusaurus/Link';
import { useHistory, useLocation } from '@docusaurus/router';
import Layout from '@theme/Layout';

import { ApplicationForm, ApplyHero, FieldDef } from './_shared';
import styles from './apply.module.scss';

const FORM_KEY = 'opencache-provider';

// Account-style signup fields. The email becomes the PF Console username, and
// the company and website frame this as creating an account rather than
// filing an application.
const FIELDS: FieldDef[] = [
  {
    id: 'contact',
    label: 'Your name',
    type: 'text',
    required: true,
    half: true,
    autoComplete: 'name',
  },
  {
    id: 'email',
    label: 'Work email',
    type: 'email',
    required: true,
    half: true,
    maxLength: 254,
    autoComplete: 'email',
  },
  {
    id: 'account',
    label: 'Company',
    type: 'text',
    required: true,
    half: true,
    autoComplete: 'organization',
  },
  {
    id: 'domain',
    label: 'Company website',
    type: 'text',
    required: true,
    half: true,
    placeholder: 'e.g. example.com',
    pattern: {
      regex: /^[^\s/]+\.[^\s/]+$/,
      message: 'Enter a domain like example.com, with no http:// or path.',
    },
  },
  {
    id: 'regions',
    label: 'Audience regions',
    type: 'text',
    placeholder: 'e.g. Lebanon and the wider Middle East',
  },
  {
    id: 'notes',
    label: 'Anything we should know',
    type: 'textarea',
    short: true,
    maxLength: 2000,
  },
];

const formLead = (
  <p className={styles.formLead}>
    Creating your account sets up delivery through OpenCache and your login for
    PF Console. It is free, and your origin stays under your control.
  </p>
);

export default function SignUpOpenCache(): JSX.Element {
  const location = useLocation();
  const history = useHistory();

  // The role toggle used to live here behind ?as=isp|provider. ISPs now have
  // their own page; old ?as=isp links are forwarded there.
  useEffect(() => {
    if (new URLSearchParams(location.search).get('as') === 'isp') {
      history.replace('/apply/opencache/isp');
    }
  }, [location.search, history]);

  return (
    <Layout
      title="Create your OpenCache account"
      description="Sign up for OpenCache, P Foundation's neutral shared caching network, and serve your content from inside local networks free of charge."
    >
      <ApplyHero
        kicker="OpenCache signup"
        title="Create your OpenCache account"
        lede="Serve your content from inside local networks, free of charge. Create your account to get started, and we will set up delivery through OpenCache along with a PF Console login. Your origin and your authority over your content stay with you."
      />

      <main className={styles.formSection}>
        <div className="container">
          <div className={styles.formWrap}>
            <ApplicationForm
              formKey={FORM_KEY}
              fields={FIELDS}
              selector={formLead}
              submitLabel="Create account"
              loadingLabel="Creating your account..."
              successTitle="Your request is being reviewed"
              successMessage={(email) => (
                <>
                  Thanks for signing up. As soon as we approve your account, we
                  will email a link to <strong>{email}</strong> to finish your
                  signup and sign in to PF Console.
                </>
              )}
            />
            <p className={styles.crossLink}>
              Run a network and want to host a node?{' '}
              <Link to="/apply/opencache/isp">Apply as an ISP</Link>.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
