import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import OverlayUtils from '../global/overlay-utils';

export default class QuickCart {
  constructor() {
    this.$body = $(document.body);
    this.overlayUtils = new OverlayUtils();

    this.cartAddHooks = [
      'cart-item-add-remote', 'cart-item-update-remote', 'cart-item-remove-remote',
    ];

    this.$quickCartContent = $('[data-quick-cart-content]');
    this.$quickCartTotals = $('[data-quick-cart-totals]');

    this._bindEvents();
  }

  /**
   *
   * @private
   *
   * Until Cart has more than one bootstrapping method, _bindEvents() initialises all functionality
   * TODO: If more core methods get added, break into seperate files OR have _bindEvents(){ this_bindCart(); _bindOther()
   */
  _bindEvents() {

    const debounceTimeout = 400;
    const quickCartUpdate = _.bind(_.debounce(this._quickCartUpdate, debounceTimeout), this);

    // cart update
    this.$quickCartContent.on('click', '[data-quick-cart-update]', (event) => {
      event.preventDefault();

      const $target = $(event.currentTarget);
      quickCartUpdate($target);
    });

    this.$body.on('quick-cart-refresh', (event) => {
      event.preventDefault();
      this._refreshContent();
    });

    // -- Iterates through each standard cart emit -- //
    this.cartAddHooks.forEach((hook) => {
      utils.hooks.on(hook, () => {
        this._refreshContent();
      });
    });

  }

  _quickCartUpdate($target) {
    const itemId = $target.data('item-id');
    const $el = $(`#quick-cart-qty-${itemId}`);
    let oldQuantity = parseInt($el.data('value'), 10);

    this.overlayUtils.show();
    const newQuantity = $target.data('action') === 'increase' ? oldQuantity + 1 : oldQuantity - 1;

    utils.api.cart.itemUpdate(itemId, newQuantity, (err, response) => {

      if (response.data.status === 'succeed') {
        // if the quantity is changed "1" from "0", we have to remove the row.
        oldQuantity = newQuantity;
        this._refreshContent();
      } else {
        $el.data('value', oldQuantity);
        this._showMessage(response.data.errors);
      }
    });
  }

  _refreshContent() {
    const options = {
      template: {
        content: 'cart/quick-cart-content',
        totals: 'cart/quick-cart-totals',
      },
    };

    utils.api.cart.getContent(options, (err, response) => {
      this.$quickCartContent.html(response.content);
      this.$quickCartTotals.html(response.totals);

      this.$quickCartContent.promise().done(() => {
        this.$quickCartTotals.promise().done(() => {
          $('[data-quick-cart-content]', this.$quickCartContent).data('quick-cart-content');
          this.overlayUtils.hide();
        });
      });

    });
  }

  /**
   *
   * @param message
   * @private
   *
   * Currently just alerts a simplified version of the system's error message
   * If this method needs to display dependent on errorType, change method to
   * _showMessage(message, errorType){};
   */
  _showMessage(message) {

    //TODO: Add this as a message on the sidebar
    alert(message.join('\n'));

  }
}
