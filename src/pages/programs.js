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
var Programs_1 = require('../components/programs/Programs');
var citizenMesh_md_1 = require('./assets/programs/citizenMesh.md');
var mediaGuard_md_1 = require('./assets/programs/mediaGuard.md');
var resilientNet_md_1 = require('./assets/programs/resilientNet.md');
var programs = [
  {
    title: 'Media Guard',
    description: react_1.default.createElement(mediaGuard_md_1.default, null),
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
    title: 'Citizen Mesh',
    description: react_1.default.createElement(citizenMesh_md_1.default, null),
    beneficiaries: [
      {
        name: 'cmp@p.foundation',
        location: 'Lebanon',
        date: 'Open',
      },
    ],
    applyURL: 'mailto:cmp@p.foundation',
  },
  {
    title: 'ResilientNet',
    description: react_1.default.createElement(resilientNet_md_1.default, null),
    beneficiaries: [
      {
        name: 'resilient@p.foundation',
        location: 'Lebanon',
        date: 'Open',
      },
    ],
    applyURL: 'mailto:resilient@p.foundation',
  },
];
var title = 'Programs';
var description = 'Current active programs';
function Programs() {
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
        programs.map(function (programData) {
          return react_1.default.createElement(
            Programs_1.default,
            __assign({ key: programData.title }, programData)
          );
        })
      )
    )
  );
}
exports.default = Programs;
