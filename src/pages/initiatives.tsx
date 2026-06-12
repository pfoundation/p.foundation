import React from 'react';
import Layout from '@theme/Layout';

import {
  Project,
  ProjectData,
  ProjectGrid,
} from '../components/projects/Project';

const projects: ProjectData[] = [
  {
    title: 'LebanonAlerts',
    description: `Established in the wake of the 6 February 2023 Turkey-Syria earthquake, "Lebanon Alerts" is a X account committed to bridging the information gap experienced by the Lebanese populace. Born from the pressing need for transparency and timely updates, the account integrates with Raspberry Shake and global seismographic networks, delivering real-time seismic activity reports. Additionally, a dedicated YouTube live stream offers a continuous visual of the seismographs, ensuring data transparency and public awareness.`,
    role: 'Active',
    x: 'LebanonAlerts',
    youtube: 'LebanonAlerts',
  },
  {
    title: 'Lebanon IA Monitor',
    description: `A pivotal initiative aimed at maintaining transparency in Lebanon's internet landscape. Recognizing that ISPs often refrain from acknowledging outages, especially when attributed to maintenance or sourcing lapses, this platform diligently monitors internet access across various providers. Offering real-time outage reports, it harnesses data from diverse sources such as real-time traffic to partner websites/apps, RIPE Atlas, and a network of mobile devices strategically placed throughout Lebanon.`,
    role: 'Active',
    x: 'LebanonIAMonitor',
  },
  {
    title: 'PTUN',
    description: ``,
    role: 'Active',
  },
  {
    title: 'Open Reporting',
    description: ``,
    role: 'Queued',
  },
  {
    title: 'National Digital Archive',
    description: ``,
    role: 'Queued',
  },
];

const title = 'Initiatives';
const description =
  'P Foundation initiatives, from real-time seismic alerts and internet access monitoring in Lebanon to upcoming open reporting and digital archive projects.';

export default function InitiativesPage(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <main>
        <section className="pf-section">
          <div className="container">
            <span className="pf-kicker">Initiatives</span>
            <h1>{title}</h1>
            <p className="pf-lede">
              Focused efforts that keep people connected and informed. Some are
              live today, others are queued for what comes next.
            </p>
            <div className="margin-top--lg">
              <ProjectGrid>
                {projects.map((project, index) => (
                  <Project key={project.title} index={index} {...project} />
                ))}
              </ProjectGrid>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
