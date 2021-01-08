export default class SearchModal {
  constructor() {

    this.$body = $('body');
    this.$overlay = $('.search-overlay');
    this.$input = $('.search-overlay-input');
    this.$closeButton = $('.search-overlay-close');

    this._bindEvents();

  }

  _bindEvents() {
    $('.toggle-search').on('click', (event) => {
      event.preventDefault();
      if (this.$body.hasClass('main-nav-open')) {
        this.$body.trigger('close-all-slideouts');
      }
      if (this.$body.hasClass('mobile-menu-open')) {
        this.$body.trigger('close-mobile-nav');
      }
      this._openSearch();
    });

    this.$closeButton.on('click', (event) => {
      event.preventDefault();
      this._closeSearch();
    });

    this._bindOverlayClick();
    this._bindCloseEsc();
  }

  /**
   * close modal if we click on a close button
   */
  _bindOverlayClick() {
    this.$overlay.on('click', (event) => {
      if (event.target === event.currentTarget) {
        this._closeSearch();
      }
    });
  }

  /**
   * close modal if we press the escape button when it's visible
   */
  _bindCloseEsc() {
    $(document).on('keyup', (event) => {
      if (event.keyCode === 27 && this.$overlay.hasClass('visible')) {
        event.preventDefault();
        this._closeSearch();
      }
    });
  }

  _openSearch() {
    this.$overlay.addClass('visible');
    setTimeout(()=> {
      this.$input.trigger('focus');
    }, 100);

  }

  _closeSearch() {
    if (this.$overlay.hasClass('visible')) {
      this.$overlay.removeClass('visible');
    }
    this.$input.trigger('focus');
  }
}
