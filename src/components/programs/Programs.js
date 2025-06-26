'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var clsx_1 = require('clsx');
var react_1 = require('react');
var Programs_module_scss_1 = require('./Programs.module.scss');
var icon_recording_svg_1 = require('./assets/icon-recording.svg');
var icon_slides_svg_1 = require('./assets/icon-slides.svg');
var icon_repository_svg_1 = require('./assets/icon-repository.svg');
var icon_calendar_svg_1 = require('./assets/icon-calendar.svg');
var icon_message_svg_1 = require('./assets/icon-message.svg');
var icon_location_svg_1 = require('./assets/icon-location.svg');
var Program = function (_a) {
  var title = _a.title,
    description = _a.description,
    _b = _a.beneficiaries,
    beneficiaries = _b === void 0 ? [] : _b,
    recordingURL = _a.recordingURL,
    slidesURL = _a.slidesURL,
    repoURL = _a.repoURL,
    applyURL = _a.applyURL;
  return react_1.default.createElement(
    'div',
    { className: 'col col--12' },
    react_1.default.createElement(
      'div',
      {
        className: (0, clsx_1.default)(
          'card',
          Programs_module_scss_1.default.card
        ),
      },
      react_1.default.createElement(
        'div',
        { className: 'card__header' },
        react_1.default.createElement('h2', null, title)
      ),
      react_1.default.createElement(
        'div',
        { className: 'card__body' },
        react_1.default.createElement(
          'div',
          { className: 'row' },
          react_1.default.createElement(
            'div',
            { className: 'col col--7' },
            description
          ),
          react_1.default.createElement(
            'div',
            {
              className: (0, clsx_1.default)(
                'col col--5',
                Programs_module_scss_1.default.eventDetailsContainer
              ),
            },
            react_1.default.createElement(ProgramDetails, {
              data: beneficiaries,
            })
          )
        )
      ),
      react_1.default.createElement(
        'div',
        { className: 'card__footer' },
        react_1.default.createElement(
          'div',
          { className: Programs_module_scss_1.default.buttons },
          applyURL &&
            react_1.default.createElement(
              'a',
              {
                href: applyURL,
                target: '_blank',
                className: 'button button--primary button--outline',
              },
              react_1.default.createElement(
                'span',
                { className: 'button__icon' },
                react_1.default.createElement(icon_message_svg_1.default, null)
              ),
              'Apply'
            ),
          recordingURL &&
            react_1.default.createElement(
              'a',
              {
                href: recordingURL,
                target: '_blank',
                className: 'button button--primary button--outline',
              },
              react_1.default.createElement(
                'span',
                { className: 'button__icon' },
                react_1.default.createElement(
                  icon_recording_svg_1.default,
                  null
                )
              ),
              'Watch recording'
            ),
          slidesURL &&
            react_1.default.createElement(
              'a',
              {
                href: slidesURL,
                target: '_blank',
                className: 'button button--secondary button--outline',
              },
              react_1.default.createElement(
                'span',
                { className: 'button__icon' },
                react_1.default.createElement(icon_slides_svg_1.default, null)
              ),
              'See slides'
            ),
          repoURL &&
            react_1.default.createElement(
              'a',
              {
                href: repoURL,
                target: '_blank',
                className: 'button button--secondary button--outline',
              },
              react_1.default.createElement(
                'span',
                { className: 'button__icon' },
                react_1.default.createElement(
                  icon_repository_svg_1.default,
                  null
                )
              ),
              'See repository'
            )
        )
      )
    )
  );
};
var ProgramDetails = function (_a) {
  var data = _a.data;
  if (data.length === 0) {
    return null;
  }
  var firstProgram = data[0],
    otherPrograms = data.slice(1);
  var name = firstProgram.name,
    location = firstProgram.location,
    date = firstProgram.date;
  return react_1.default.createElement(
    'div',
    { className: 'row' },
    react_1.default.createElement(
      'div',
      { className: 'col col--12' },
      react_1.default.createElement(
        'ul',
        { className: Programs_module_scss_1.default.list },
        react_1.default.createElement(
          'li',
          null,
          react_1.default.createElement(icon_message_svg_1.default, {
            className: Programs_module_scss_1.default.icon,
          }),
          ' ',
          react_1.default.createElement('strong', null, name)
        ),
        react_1.default.createElement(
          'li',
          null,
          react_1.default.createElement(icon_location_svg_1.default, {
            className: Programs_module_scss_1.default.icon,
          }),
          ' ',
          location
        ),
        react_1.default.createElement(
          'li',
          null,
          react_1.default.createElement(icon_calendar_svg_1.default, {
            className: Programs_module_scss_1.default.icon,
          }),
          ' ',
          date
        )
      )
    ),
    data.length > 1 &&
      react_1.default.createElement(
        'div',
        { className: 'col col--12' },
        react_1.default.createElement(
          'p',
          { className: 'margin--none' },
          'Current public beneficiaries'
        ),
        react_1.default.createElement(
          'ul',
          null,
          otherPrograms.map(function (_a) {
            var name = _a.name,
              location = _a.location,
              date = _a.date;
            return react_1.default.createElement(
              'li',
              { key: name },
              react_1.default.createElement('strong', null, name),
              ' in ',
              location,
              ' since ',
              date
            );
          })
        )
      )
  );
};
function formatDateString(date) {
  return ''.concat(date.getMonth() + 1, '/').concat(date.getUTCFullYear());
}
exports.default = Program;
