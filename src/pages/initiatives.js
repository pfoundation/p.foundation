'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, '__esModule', { value: true });
var react_1 = require('react');
var Layout_1 = require('@theme/Layout');
var Project_1 = require('../components/projects/Project');
var assetsDir = './assets/initiatives';
var projects = [
  {
    title: 'LebanonAlerts',
    description:
      'Established in the wake of the 6 February 2023 Turkey-Syria earthquake, "Lebanon Alerts" is a X account committed to bridging the information gap experienced by the Lebanese populace. Born from the pressing need for transparency and timely updates, the account integrates with Raspberry Shake and global seismographic networks, delivering real-time seismic activity reports. Additionally, a dedicated YouTube live stream offers a continuous visual of the seismographs, ensuring data transparency and public awareness.',
    image: require(''.concat(assetsDir, '/placeholder.png')),
    role: 'Active',
    x: 'LebanonAlerts',
    youtube: 'LebanonAlerts',
  },
  {
    title: 'Lebanon IA Monitor',
    description:
      "A pivotal initiative aimed at maintaining transparency in Lebanon's internet landscape. Recognizing that ISPs often refrain from acknowledging outages, especially when attributed to maintenance or sourcing lapses, this platform diligently monitors internet access across various providers. Offering real-time outage reports, it harnesses data from diverse sources such as real-time traffic to partner websites/apps, RIPE Atlas, and a network of mobile devices strategically placed throughout Lebanon.",
    image: require(''.concat(assetsDir, '/placeholder.png')),
    role: 'Active',
    x: 'LebanonIAMonitor',
  },
  {
    title: 'PTUN',
    description: '',
    image: require(''.concat(assetsDir, '/placeholder.png')),
    role: 'Active',
  },
  {
    title: 'Open Reporting',
    description: '',
    image: require(''.concat(assetsDir, '/placeholder.png')),
    role: 'Queued',
  },
  {
    title: 'National Digital Archive',
    description: '',
    image: require(''.concat(assetsDir, '/placeholder.png')),
    role: 'Queued',
  },
];
var title = 'Initiaves';
var description = 'Featured initiatives we are involved in.';
function Projects() {
  return react_1.default.createElement(
    Layout_1.default,
    { title: title, description: description },
    react_1.default.createElement(
      'main',
      { className: 'container container--fluid margin-vert--lg' },
      react_1.default.createElement('h1', null, title),
      react_1.default.createElement('p', null, description),
      react_1.default.createElement(
        'div',
        { className: 'row' },
        projects.map(function (project) {
          return react_1.default.createElement(
            Project_1.Project,
            __assign({ key: project.title }, project)
          );
        })
      )
    )
  );
}
exports.default = Projects;
