'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Newsletter = void 0;
var react_1 = require('react');
var icon_news_svg_1 = require('./assets/icon-news.svg');
var Newsletter_module_scss_1 = require('./Newsletter.module.scss');
var Newsletter = function (_a) {
  var data = _a.data;
  var action = data.action,
    method = data.method,
    emailFieldName = data.emailFieldName,
    firstNameFieldName = data.firstNameFieldName,
    submitButtonName = data.submitButtonName,
    tosURL = data.tosURL,
    privacyPolicyURL = data.privacyPolicyURL,
    serviceName = data.serviceName;
  return react_1.default.createElement(
    'div',
    { className: Newsletter_module_scss_1.default.newsWrapper },
    react_1.default.createElement(
      'div',
      { className: 'container padding-vert--lg' },
      react_1.default.createElement(icon_news_svg_1.default, {
        className: Newsletter_module_scss_1.default.newsIcon,
      }),
      react_1.default.createElement(
        'h2',
        null,
        'Subscribe to updates about P Foundation\u2019s work'
      ),
      react_1.default.createElement(
        'form',
        {
          action: action,
          className: Newsletter_module_scss_1.default.form,
          method: method,
          target: '_blank',
        },
        react_1.default.createElement('input', {
          name: emailFieldName,
          placeholder: 'Your email',
          type: 'email',
          required: true,
        }),
        react_1.default.createElement(
          'div',
          {
            style: { position: 'absolute', left: '-5000px' },
            'aria-hidden': 'true',
          },
          react_1.default.createElement('input', {
            type: 'text',
            name: 'b_4ed0fd1909674fddee53ac3e7_dfdcae99f5',
            tabIndex: -1,
            value: '',
          })
        ),
        react_1.default.createElement(
          'button',
          {
            type: 'submit',
            name: submitButtonName,
            disabled: true,
            className: 'button button--primary button--newsletter',
          },
          'Subscribe'
        )
      ),
      react_1.default.createElement(
        'div',
        { className: Newsletter_module_scss_1.default.formFooter },
        'By entering your email address and clicking \u201CSubscribe\u201D, you agree to receive updates from the P Foundation about our work. ',
        react_1.default.createElement('br', null),
        'To learn more about how we use and protect your personal data, please view our privacy policy.'
      )
    )
  );
};
exports.Newsletter = Newsletter;
