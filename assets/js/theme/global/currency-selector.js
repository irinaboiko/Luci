
export default class CurrencySelector {

  constructor(el) {
    this.$el = $(el);
    this._bindEvents();
  }

  _bindEvents() {
    this.$el.on('change', () => {
      this._updateCurrency();
    });
  }

  _updateCurrency() {
    window.location = this.$el.val();
  }
}
