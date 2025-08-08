'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.AboutMe = void 0;
var react_1 = require('react');
var clsx_1 = require('clsx');
var AboutMe_module_scss_1 = require('./AboutMe.module.scss');
var AboutMe = function (_a) {
  var avatar = _a.avatar,
    descriptionComponent = _a.descriptionComponent;
  return react_1.default.createElement(
    'div',
    { className: 'margin-top--lg' },
    react_1.default.createElement('h2', null, 'About us'),
    react_1.default.createElement(
      'div',
      { className: 'row' },
      react_1.default.createElement(
        'div',
        { className: 'col col--9' },
        descriptionComponent
      ),
      react_1.default.createElement(
        'div',
        {
          className: (0, clsx_1.default)(
            'col col--2',
            AboutMe_module_scss_1.default.avatarContainer
          ),
        },
        react_1.default.createElement('div', {
          className: AboutMe_module_scss_1.default.avatar,
        })
      )
    )
  );
};
exports.AboutMe = AboutMe;
