import React from 'react';
import Layout from '@theme/Layout';

import Program, { ProgramMetadata } from '../components/programs/Programs';

import BuildingGQLAPIForK8sResDescription from './assets/programs/_building-gql-api-for-k8s-res.md';
import CommunityMesh from './assets/programs/communityMesh.md';
import MediaGuard from './assets/programs/mediaGuard.md';

const programs: ProgramMetadata[] = [
  {
    title: 'Media Guard',
    description: <MediaGuard />,
    beneficiaries: [
      {
        name: 'mediaguard@p.foundation',
        location: 'Worldwide',
        date: 'Open/Extended Deadline',
      },
      // {
      //   name: "NA",
      //   location: "NA",
      //   date: "XA",
      // },
    ],
    applyURL: 'mailto:mediaguard@p.foundation',
  },
  {
    title: 'Community Mesh',
    description: <CommunityMesh />,
    beneficiaries: [
      {
        name: 'cmp@p.foundation',
        location: 'Lebanon',
        date: 'Open',
      },
    ],
    applyURL: 'mailto:cmp@p.foundation',
  },
];

const title = 'Programs';
const description = 'Current active programs';

export default function Programs(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <main className="container container--fluid margin-vert--lg">
        <h1>{title}</h1>
        <p>{description}</p>

        <div className="row">
          {programs.map((programData) => (
            <Program key={programData.title} {...programData} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
