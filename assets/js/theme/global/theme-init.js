import _ from 'lodash';

/*
 * Runs things on page load.
 * Currently just testing for touch events, might do more, might get replaced with Modernizr
 */

export default class ThemeInit {

  constructor() {

    $(document).ready(() => {
      this._addClasses();
      this._dismissable();
      this._truncateExcerpts();
      this._bindCheckboxes();
    });
  }


  // -------------------------- Very basic touch detection -------------------------- //

  _addClasses() {
    const classes = ['js'];

    if (this._isTouch()) {
      classes.push('has-touch');
    } else {
      classes.push('no-touch');
    }

    if (this._isIE()){
      classes.push('ie');
    }

    $('html').removeClass('no-js').addClass(classes.join(' '));
  }

  _isTouch() {
    // http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
    return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
  }

  _isIE() {
    // From http://codepen.io/gapcode/pen/vEJNZN
    const userAgent = window.navigator.userAgent;

    const msie = userAgent.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(userAgent.substring(msie + 5, userAgent.indexOf('.', msie)), 10);
    }

    const trident = userAgent.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      const rv = userAgent.indexOf('rv:');
      return parseInt(userAgent.substring(rv + 3, userAgent.indexOf('.', rv)), 10);
    }

    const edge = userAgent.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(userAgent.substring(edge + 5, userAgent.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
  }

  // Binds labels or other wrappers to their checkboxes //

  _bindCheckboxes() {
    $(document.body).on('click', '[data-radio-button]', (event) => {
      event.preventDefault();
      const $checkbox = $(event.currentTarget).find('input');

      // need to wrap in a timeout to bypass the preventDefault
      setTimeout(() => {
        $checkbox.prop('checked', !$checkbox.prop('checked'));
        $checkbox.blur();
      }, 1);
    });
  }

  // -------------------------- Dismissable messages -------------------------- //

  _dismissable() {
    $('body').on('click', '.alert-message .dismiss', (event) => {
      event.preventDefault();
      const $target = $(event.currentTarget);
      const $message = $target.parent('.alert-message');

      $message.one('trend', () => {
        $message.addClass('hidden');
      });

      $message.revealer('hide');
    });
  }


  // -------------------------- Javascript Excerpts -------------------------- //

  _truncateExcerpts() {
    const $excerpts = $('.has-excerpt');

    $excerpts.each((i, el) => {
      const $excerpt = $(el);
      const length = $excerpt.data('excerpt-length') || 200;
      const text = _.trunc($excerpt.text(), {
        length,
        separator: ' ',
      });

      $excerpt.text(text).addClass('loaded');
    });
  }
}

