import React from 'react';
import Layout from '@theme/Layout';

import { Program, ProgramMetadata } from '../components/programs/Programs';

import CitizenMesh from './assets/programs/citizenMesh.md';
import MediaGuard from './assets/programs/mediaGuard.md';
import ResilientNet from './assets/programs/resilientNet.md';

const programs: ProgramMetadata[] = [
  {
    title: 'MediaGuard',
    description: <MediaGuard />,
    provides: [
      'Backhaul support',
      'Downlinking',
      'Digital streaming',
      'Content distribution',
    ],
    relatedProducts: [
      {
        name: 'OpenNRCS',
        to: '/products/opennrcs',
        note: 'a full newsroom computer system, from wire to air to web',
      },
      {
        name: 'Hosted Media Services',
        to: '/products/hms',
        note: 'one backend for video on demand and live channels, with DVR and restreaming',
      },
      {
        name: 'AI dubbing',
        to: '/products/dubbing',
        note: 'broadcast-ready dubbing of finished video into other languages',
      },
    ],
    beneficiaries: [
      {
        name: 'mediaguard@p.foundation',
        location: 'Worldwide',
        date: 'Open/Extended Deadline',
      },
    ],
    applyURL: '/apply?program=mediaguard',
  },
  {
    title: 'CitizenMesh',
    description: <CitizenMesh />,
    provides: [
      'Community-built networks',
      'Free access in schools, libraries, and public spaces',
    ],
    /*   relatedProducts: [
      {
        name: 'OpenCache',
        to: '/products/opencache',
        note: 'serves popular content from inside local networks like the ones this program builds',
      },
    ], */
    beneficiaries: [
      {
        name: 'cmp@p.foundation',
        location: 'Lebanon',
        date: 'Open',
      },
    ],
    applyURL: '/apply?program=citizenmesh',
  },
  {
    title: 'ResilientNet',
    description: <ResilientNet />,
    provides: [
      'Needs-based assessments',
      'Custom network design',
      'Volunteer deployment for healthcare, emergency services, and utilities',
    ],
    /* relatedProducts: [
      {
        name: 'OpenCache',
        to: '/products/opencache',
        note: 'serves popular content from inside local networks',
      },
    ], */
    beneficiaries: [
      {
        name: 'resilient@p.foundation',
        location: 'Lebanon',
        date: 'Open',
      },
    ],
    applyURL: '/apply?program=resilientnet',
  },
];

const title = 'Programs';
const description =
  'P Foundation programs with open applications: MediaGuard extends tailored support that helps media organizations worldwide maintain a steady presence, while CitizenMesh and ResilientNet build community connectivity in Lebanon for schools, libraries, public spaces, and critical installations.';

export default function ProgramsPage(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <main>
        <section className="pf-section">
          <div className="container">
            <span className="pf-kicker">Programs</span>
            <h1>{title}</h1>
            <p className="pf-lede">
              Three programs are active and accepting applications today.
              MediaGuard helps media organizations worldwide maintain a steady
              presence. CitizenMesh and ResilientNet bring community-built
              connectivity to Lebanon, from schools, libraries, and public
              spaces to healthcare, emergency services, and utilities.
            </p>
            <div className="margin-top--lg">
              {programs.map((programData) => (
                <Program key={programData.title} {...programData} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
