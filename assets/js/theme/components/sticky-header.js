import _ from 'lodash';

import ThemeUtilities from '../global/theme-utilities';

export default class StickyHeader {
  constructor(context) {
    this.context = context;
    this.themeUtilities = new ThemeUtilities(this.context);

    this.$body = $(document.body);
    this.$mainHeader = $('.main-header');
    this.$mainContent = $('.main-content');
    this.$headerLogo = $('.header-logo-image');
    this.$headerLogoText = $('.header-logo-text');
    this.headerHasLogo = (this.$headerLogo.length ? true : false);
    this.$window = $(window);
    this.debounceTimeout = 200;
    this._bindEvents();

  }

  _bindEvents() {
    this._canAnimate('force');
    this._triggerAlternateHeader();

    this.$window.on('resize', ()=> {
      _.debounce(() => {
        this._canAnimate();
        this._stickyHeader();
        this._triggerAlternateHeader('force');
      }, this.debounceTimeout);
    });

    this.$window.on('scroll', ()=> {
      this._canAnimate();
      this._stickyHeader();
      this._triggerAlternateHeader();
    });
  }

  _headerHeight() {
    return this.$mainHeader.outerHeight();
  }

  _scrollOffset() {
    return this._headerHeight() + 400;
  }

  _canAnimate(force = false) {
    if ((force && !this.$body.hasClass('alternate-header')) && !this.$body.hasClass('has-carousel')) {
      $('.main-header-menu').one('trend', () => {
        this.$mainContent.addClass('can-animate');
      });
    }
  }

  _stickyHeader() {
    if ((this.$window.scrollTop() > this._scrollOffset()) || this.themeUtilities.isSmallScreen()) {
      this.$body.addClass('sticky-header');
    } else {
      this.$body.removeClass('sticky-header');
    }
  }

  _triggerAlternateHeader() {

    if (this.$window.scrollTop() > this._scrollOffset()) {

      if(this.$body.hasClass('alternate-header') && (this.$window.scrollTop() > this._scrollOffset())){
        this.$body.addClass('header-positioned');
      }

      this.$body.addClass('alternate-header');

      if (this.headerHasLogo) {
        this.$headerLogo.revealer('hide', true);
        this.$headerLogoText.revealer('show');
      }

    } else {
      this.$body.removeClass('header-positioned').removeClass('alternate-header');

      this._canAnimate('force');

      if (this.headerHasLogo) {
        this.$headerLogoText.revealer('hide', true);
        this.$headerLogo.revealer('show');
      }

    }
  }

}

