'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Hero = void 0;
var clsx_1 = require('clsx');
var react_1 = require('react');
var Hero_module_scss_1 = require('./Hero.module.scss');
var Hero = function () {
  return react_1.default.createElement(
    'header',
    {
      className: (0, clsx_1.default)(
        'hero hero--primary',
        Hero_module_scss_1.default.heroBanner
      ),
    },
    react_1.default.createElement(
      'div',
      { className: 'container' },
      react_1.default.createElement(
        'h1',
        {
          className: (0, clsx_1.default)(
            'hero__title',
            Hero_module_scss_1.default.title
          ),
        },
        'Empowering nations with',
        ' ',
        react_1.default.createElement(
          'span',
          { className: Hero_module_scss_1.default.highlighted },
          'open internet'
        ),
        ' and',
        ' ',
        react_1.default.createElement(
          'span',
          { className: Hero_module_scss_1.default.highlighted },
          'free journalism'
        ),
        '.'
      ),
      react_1.default.createElement(
        'p',
        {
          className: (0, clsx_1.default)(
            'hero__subtitle',
            Hero_module_scss_1.default.subtitle
          ),
        },
        'Bridging the digital divide, the P Foundation is committed to connecting communities and fostering a world of informed, global collaboration.'
      )
    )
  );
};
exports.Hero = Hero;
