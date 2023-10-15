import React from 'react';
import Layout from '@theme/Layout';

import { Project, ProjectData } from '../components/projects/Project';

const assetsDir = './assets/initiatives';
const projects: ProjectData[] = [
  {
    title: 'LebanonAlerts',
    description: `Established in the wake of the 6 February 2023 Turkey-Syria earthquake, "Lebanon Alerts" is a X account committed to bridging the information gap experienced by the Lebanese populace. Born from the pressing need for transparency and timely updates, the account integrates with Raspberry Shake and global seismographic networks, delivering real-time seismic activity reports. Additionally, a dedicated YouTube live stream offers a continuous visual of the seismographs, ensuring data transparency and public awareness.`,
    image: require(`${assetsDir}/placeholder.png`),
    role: 'Active',
    x: 'LebanonAlerts',
    youtube: 'LebanonAlerts',
  },
  {
    title: 'Lebanon IA Monitor',
    description: `A pivotal initiative aimed at maintaining transparency in Lebanon's internet landscape. Recognizing that ISPs often refrain from acknowledging outages, especially when attributed to maintenance or sourcing lapses, this platform diligently monitors internet access across various providers. Offering real-time outage reports, it harnesses data from diverse sources such as real-time traffic to partner websites/apps, RIPE Atlas, and a network of mobile devices strategically placed throughout Lebanon.`,
    image: require(`${assetsDir}/placeholder.png`),
    role: 'Active',
    x: 'LebanonIAMonitor',
  },
  {
    title: 'PTUN',
    description: ``,
    image: require(`${assetsDir}/placeholder.png`),
    role: 'Active',
  },
  {
    title: 'Open Reporting',
    description: ``,
    image: require(`${assetsDir}/placeholder.png`),
    role: 'Queued',
  },
  {
    title: 'National Digital Archive',
    description: ``,
    image: require(`${assetsDir}/placeholder.png`),
    role: 'Queued',
  },
];

const title = 'Initiaves';
const description = 'Featured initiatives we are involved in.';

export default function Projects(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <main className="container container--fluid margin-vert--lg">
        <h1>{title}</h1>
        <p>{description}</p>

        <div className="row">
          {projects.map((project) => (
            <Project key={project.title} {...project} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
