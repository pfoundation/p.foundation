import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import { AboutMe } from '../components/homepage/AboutMe';
import { DonateCta } from '../components/homepage/DonateCta';
import { FocusAreas } from '../components/homepage/FocusAreas';
import { Hero } from '../components/homepage/Hero';
import { ImpactStats } from '../components/homepage/ImpactStats';
import { LatestUpdates } from '../components/homepage/LatestUpdates';

import AboutMeDesc from './assets/index/_about.md';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <Hero />
      <main>
        {/* <ImpactStats />
        <FocusAreas /> */}
        <AboutMe descriptionComponent={<AboutMeDesc />} />
        <LatestUpdates />
        <DonateCta />
      </main>
    </Layout>
  );
}
