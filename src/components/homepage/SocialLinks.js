'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SocialLinks = exports.defaultSocialLinkData = void 0;
var clsx_1 = require('clsx');
var react_1 = require('react');
var SocialLinks_module_scss_1 = require('./SocialLinks.module.scss');
exports.defaultSocialLinkData = [
  {
    name: 'GitHub',
    url: 'https://github.com/pfoundation',
    svg: react_1.default.createElement(
      'svg',
      {
        role: 'img',
        viewBox: '0 0 24 24',
        xmlns: 'http://www.w3.org/2000/svg',
      },
      react_1.default.createElement('title', null, 'GitHub'),
      react_1.default.createElement('path', {
        d: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
      })
    ),
  },
  {
    name: 'X',
    url: 'https://x.com/pfoundation',
    svg: react_1.default.createElement(
      'svg',
      {
        role: 'img',
        viewBox: '0 0 24 24',
        xmlns: 'http://www.w3.org/2000/svg',
      },
      react_1.default.createElement('title', null, 'Twitter'),
      react_1.default.createElement('path', {
        d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
      })
    ),
  },
];
var SocialLinks = function (_a) {
  var data = _a.data;
  var socialLinksComponents = data.map(function (_a) {
    var name = _a.name,
      url = _a.url,
      svg = _a.svg;
    return react_1.default.createElement(
      'div',
      {
        className: (0, clsx_1.default)(
          'col',
          SocialLinks_module_scss_1.default.col
        ),
        key: name,
      },
      react_1.default.createElement(
        'a',
        {
          href: url,
          target: '_blank',
          className: (0, clsx_1.default)(
            'button button--outline button--primary',
            SocialLinks_module_scss_1.default.btn
          ),
        },
        react_1.default.createElement(
          'span',
          { className: SocialLinks_module_scss_1.default.btnIcon },
          svg
        )
      )
    );
  });
  return react_1.default.createElement(
    'div',
    { className: SocialLinks_module_scss_1.default.socialContainer },
    react_1.default.createElement(
      'div',
      {
        className: (0, clsx_1.default)(
          'row',
          SocialLinks_module_scss_1.default.socialLinks
        ),
      },
      socialLinksComponents
    )
  );
};
exports.SocialLinks = SocialLinks;
