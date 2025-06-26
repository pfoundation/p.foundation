'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var react_1 = require('react');
var useDocusaurusContext_1 = require('@docusaurus/useDocusaurusContext');
var Layout_1 = require('@theme/Layout');
var AboutMe_1 = require('../components/homepage/AboutMe');
var Hero_1 = require('../components/homepage/Hero');
//import avatar from "./assets/index/avatar.jpg";
var _about_md_1 = require('./assets/index/_about.md');
function Home() {
  var siteConfig = (0, useDocusaurusContext_1.default)().siteConfig;
  return react_1.default.createElement(
    Layout_1.default,
    { title: 'Home', description: siteConfig.tagline },
    react_1.default.createElement(Hero_1.Hero, null),
    react_1.default.createElement(
      'main',
      null,
      react_1.default.createElement(
        'div',
        { className: 'container padding-vert' },
        react_1.default.createElement(AboutMe_1.AboutMe, {
          descriptionComponent: react_1.default.createElement(
            _about_md_1.default,
            null
          ),
        })
      )
    )
  );
}
exports.default = Home;
