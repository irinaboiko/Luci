import ThemeUtilities from '../global/theme-utilities';

export default class SharingButtons {
  constructor(el, context) {
    this.selector = el;
    this.context = context;
    this.$el = $(this.selector);
    this.themeUtilities = new ThemeUtilities(this.context);
    this._removeTargetAttribute();
    this._bindEvents();
  }

  _removeTargetAttribute() {
    const $buttons = this.$el;

    $buttons.each((i, el) => {
      const $target = $(el);

      $target.removeAttr('target');
      $target.data('popup-url', $target.attr('href'));
      $target.attr('href', '#');
    });
  }

  _bindEvents() {

    this.$el.on('click', (event) => {
      event.preventDefault();
      const $target = $(event.currentTarget).closest(this.selector);
      const url = $target.data('popup-url');
      const title = $target.data('popup-title');
      const width = $target.data('popup-width');
      const height = $target.data('popup-height');

      this.themeUtilities.popupCenter(url, title, width, height);
    });
  }
}

