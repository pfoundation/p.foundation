'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Project = void 0;
var clsx_1 = require('clsx');
var react_1 = require('react');
var IdealImage_1 = require('@theme/IdealImage');
var icon_discover_svg_1 = require('./assets/icon-discover.svg');
var icon_x_svg_1 = require('./assets/icon-x.svg');
var icon_youtube_svg_1 = require('./assets/icon-youtube.svg');
var Project_module_scss_1 = require('./Project.module.scss');
var Project = function (_a) {
  var title = _a.title,
    description = _a.description,
    url = _a.url,
    x = _a.x,
    youtube = _a.youtube,
    role = _a.role,
    image = _a.image;
  return react_1.default.createElement(
    'div',
    {
      className: (0, clsx_1.default)(
        'col col--6',
        Project_module_scss_1.default.cardContainer
      ),
    },
    react_1.default.createElement(
      'div',
      {
        className: (0, clsx_1.default)(
          'card',
          Project_module_scss_1.default.card
        ),
      },
      react_1.default.createElement(
        'div',
        {
          className: (0, clsx_1.default)(
            'card__image',
            Project_module_scss_1.default.image
          ),
        },
        react_1.default.createElement(IdealImage_1.default, {
          img: image,
          alt: description,
          title: title,
        }),
        role &&
          react_1.default.createElement(
            'span',
            {
              className: (0, clsx_1.default)(
                'badge badge--secondary',
                Project_module_scss_1.default.role
              ),
            },
            role
          )
      ),
      react_1.default.createElement(
        'div',
        { className: 'card__body' },
        react_1.default.createElement('h2', null, title),
        react_1.default.createElement('p', null, description)
      ),
      react_1.default.createElement(
        'div',
        { className: 'card__footer' },
        react_1.default.createElement(
          'div',
          { className: Project_module_scss_1.default.buttons },
          url &&
            react_1.default.createElement(
              'a',
              {
                href: url,
                target: '_blank',
                className: 'button button--primary button--outline',
              },
              react_1.default.createElement(
                'span',
                { className: 'button__icon' },
                react_1.default.createElement(icon_discover_svg_1.default, {
                  className: Project_module_scss_1.default.icon,
                })
              ),
              'Discover'
            ),
          x &&
            react_1.default.createElement(
              'a',
              {
                href: 'https://twitter.com/'.concat(x),
                target: '_blank',
                className: 'button button--primary button--outline',
              },
              react_1.default.createElement(
                'span',
                { className: 'button__icon' },
                react_1.default.createElement(icon_x_svg_1.default, {
                  className: Project_module_scss_1.default.icon,
                })
              ),
              x
            ),
          youtube &&
            react_1.default.createElement(
              'a',
              {
                href: 'https://youtube.com/@'.concat(x),
                target: '_blank',
                className: 'button button--primary button--outline',
              },
              react_1.default.createElement(
                'span',
                { className: 'button__icon' },
                react_1.default.createElement(icon_youtube_svg_1.default, {
                  className: Project_module_scss_1.default.icon,
                })
              ),
              youtube
            )
        )
      )
    )
  );
};
exports.Project = Project;
