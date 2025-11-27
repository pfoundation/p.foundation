---
title: Traffic Statistics
description: OpenIX Beirut Traffic Statistics
---

# Traffic Statistics

export const widgetConfigs = [
{
id: 'panel-1',
title: 'Past Hours',
src: 'https://grafana.openix.ong/d-solo/admhsjl/openix-beirut-traffic-overview?orgId=1&timezone=browser&theme=light&panelId=panel-1&__feature.dashboardSceneSolo=true',
},
{
id: 'panel-2',
title: 'Past Day',
src: 'https://grafana.openix.ong/d-solo/admhsjl/openix-beirut-traffic-overview?orgId=1&from=now-24h&to=now&timezone=browser&theme=light&panelId=panel-2&__feature.dashboardSceneSolo=true',
},
{
id: 'panel-3',
title: 'Past Week',
src: 'https://grafana.openix.ong/d-solo/admhsjl/openix-beirut-traffic-overview?orgId=1&from=now-7d&to=now&timezone=browser&theme=light&panelId=panel-3&__feature.dashboardSceneSolo=true',
},
{
id: 'panel-4',
title: 'Past Month',
src: 'https://grafana.openix.ong/d-solo/admhsjl/openix-beirut-traffic-overview?orgId=1&from=now-30d&to=now&timezone=browser&theme=light&panelId=panel-4&__feature.dashboardSceneSolo=true',
},
];

<>
{widgetConfigs.map((widget) => (

<section
key={widget.id}
style={{
        marginBottom: '48px',
      }} >
<h3 style={{ marginBottom: '16px' }}>{widget.title}</h3>
<div
style={{
          boxSizing: 'content-box',
          position: 'relative',
          maxWidth: '2560px',
          aspectRatio: '2560 / 1308',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow:
            '0px 0px 1px rgba(45, 55, 72, 0.05), 0px 4px 8px rgba(45, 55, 72, 0.1)',
          overflow: 'hidden',
        }} >
<iframe
src={widget.src}
title={widget.title}
frameBorder="0"
scrolling="true"
style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }} ></iframe>
</div>
</section>
))}
</>
