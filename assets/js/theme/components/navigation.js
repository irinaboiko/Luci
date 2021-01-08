import _ from 'lodash';

import StickyHeader from './sticky-header';
import ThemeUtilities from '../global/theme-utilities';

export default class Navigation {
  constructor(context) {
    this.context = context;

    new StickyHeader(this.context);
    this.themeUtilities = new ThemeUtilities(this.context);

    this.$container = $('[data-slideout-wrapper]');
    this.$overlayBlocker = $('.navigation-overlay');
    this.$body = $(document.body);
    this.$window = $(window);

    this.$mobileNavigationToggleWrapper = $('[data-mobile-menu-button]');
    this.$mobileNavigationToggle = $('[data-mobile-menu-toggle]');

    this.$primaryTier = $('[data-navigation-tier-primary]');
    this.$secondaryTier = this.$container.find('.navigation-tier-secondary');

    this._bindEvents();

  }

  _bindEvents() {
    const debounceTimeout = 400;
    const closeSlideouts = _.bind(_.debounce(this._closeSlideOuts, debounceTimeout), this);

    this.$window.on('resize', () => {
      closeSlideouts('all');
    });

    this.$body.on('close-all-slideouts', (event) => {
      event.preventDefault();
      this._closeSlideOuts('all');
    });

    this.$body.on('close-mobile-nav', (event) => {
      event.preventDefault();
      this._closeMobileNav();
    });

    this.$overlayBlocker.on('click', (event) => {
      event.preventDefault();
      this.$body.trigger('close-all-slideouts');
      this.$body.trigger('close-mobile-nav');
    });

    /*Mobile Menu*/
    this.$mobileNavigationToggleWrapper.on('click', (event) => {
      event.preventDefault();
      this._toggleMobileNav();
    });

    /* Slideout activation */
    this.$body.on('click', '[data-slideout-menu]', (event) => {
      event.preventDefault();
      this._openMobileNav();
      this._toggleSlideOut(event);
    });

    /* Second level menu drop down toggles */
    this.$container.find('.has-dropdown > a').on('click', (event) => {
      event.preventDefault();
      this._toggleDropdown(event);
    });

  }

  // -- Mobile Navigation Methods -- //
  _openMobileNav() {
    this.$body.addClass('mobile-menu-open');
    this.$primaryTier.revealer('show');
    this.$mobileNavigationToggle.addClass('expand');
  }

  _closeMobileNav() {
    this.$body.removeClass('mobile-menu-open');
    this.$primaryTier.revealer('hide');
    this.$mobileNavigationToggle.removeClass('expand');

    if (this.$body.hasClass('main-nav-open')) {
      this._closeSlideOuts('all');
    }
  }

  _toggleMobileNav() {
    if (this.$body.hasClass('mobile-menu-open')) {
      this._closeMobileNav();
    } else {
      this._openMobileNav();
    }
  }

  _toggleDropdown(event) {
    event.preventDefault();
    const $target = $(event.target);
    const $parent = $target.parent();
    const $dropdown = $target.siblings('ul');

    if ($parent.hasClass('menu-open')) {
      $dropdown.revealer('hide');
      $parent.removeClass('menu-open');

    } else {
      $parent.addClass('menu-open');
      $dropdown.revealer('show');

      if ($dropdown.hasClass('navigation-tier-tertiary')) {
        this._closeInactiveDropdowns();
      } else if ($dropdown.hasClass('navigation-tier-quaternary')) {
        this._closeInactiveDropdowns('.navigation-tier-quaternary');
      }
    }

  }

  _closeInactiveDropdowns(selector) {
    const menuSelector = (selector ? selector : '.navigation-tier-tertiary.visible, .navigation-tier-quaternary');
    const $dropdowns = this.$container.find(menuSelector);

    for (let i = 0; i < $dropdowns.length; i++) {
      const $dropdown = $($dropdowns[i]);
      if ($dropdown.hasClass('visible')) {
        $dropdown.revealer('hide');
        $dropdowns.parent().removeClass('menu-open');
      }
    }
  }

  _openSlideOut($slideout, $target) {
    $target.addClass('menu-open');

    this.$primaryTier.addClass('slideout-open');
    this.$body.removeClass('main-nav-closed').addClass('main-nav-open scroll-locked');
    $slideout.revealer('show');
  }

  _toggleSlideOut(event) {
    event.preventDefault();
    const $target = $(event.target);
    const $slideOut = $($target.attr('href'));

    if (this.$body.hasClass('main-nav-open')) {
      if ($target.hasClass('menu-open')) {
        this._closeSlideOuts('all');
        this._closeMobileNav();
      } else {
        this._closeSlideOuts('inactive');
        this._openSlideOut($slideOut, $target);
      }
    } else {
      this._openSlideOut($slideOut, $target);
    }
    return false;
  }

  // -- Closes Slide outs, and un-selects any active slide out menu items -- //
  _closeSlideOuts(type) {
    if (type === 'inactive') {
      const $openMenus = this.$container.find('.navigation-tier-secondary:not(.hidden)');

      for (let i = 0; i < $openMenus.length; i++) {
        this._closeSlideOut($($openMenus[i]));
      }

      // -- If not inactive, then closes all -- //
    } else {
      const $allMenus = this.$secondaryTier;

      for (let i = 0; i < $allMenus.length; i++) {
        this._closeSlideOut($($allMenus[i]));
      }

      this.$primaryTier.removeClass('slideout-open');
      this.$body.removeClass('main-nav-open scroll-locked').addClass('main-nav-closed');
    }
  }

  _closeSlideOut(menu) {
    const $openMenu = $(menu);
    const $menuSelector = $(`[data-slideout-menu="${$openMenu.attr('id')}"]`);

    if ($openMenu.hasClass('visible')) {
      $openMenu.attr('style', '').revealer('hide');
      $menuSelector.removeClass('menu-open');
    }
  }

}
