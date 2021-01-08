import _ from 'lodash';
import PageManager from '../PageManager';
import utils from '@bigcommerce/stencil-utils';
import ShippingCalculator from './cart/shipping-calculator';
import CouponCodes from './cart/coupon-codes';
import GiftWrap from './cart/gift-wrap';
import GiftCertificate from './cart/gift-certificate';
import OverlayUtils from './global/overlay-utils';
import RefreshContent from './cart/refresh-content';
import ErrorAlert from './utils/error-alert';
import EditOptions from './cart/edit-options';

export default class Cart extends PageManager {
  constructor() {
    super();
    this.overlayUtils = new OverlayUtils();
    this.errorAlert = new ErrorAlert();
    this.$body = $(document.body);

    if (window.ApplePaySession && $('.dev-environment').length) {
      $(document.body).addClass('apple-pay-supported');
    }
  }

  loaded (next) {
    this.$cartContent = $('[data-cart-content]');
    this.$cartTotals = $('[data-cart-totals]');

    const $els = {
      $cartContent: this.$cartContent,
      $cartTotals: this.$cartTotals,
    };

    this._bindEvents();
    this.shippingCalculator = new ShippingCalculator(this.context, $els);
    this.couponCodes = new CouponCodes(this.context, $els);
    this.giftCertificate = new GiftCertificate(this.context, $els);
    this.giftWrap = new GiftWrap();
    this.refreshContent = new RefreshContent($els);

    this.cartEditOptions = new EditOptions(this.context);

    next();
  }

  /**
   *
   * @private
   *
   * Until Cart has more than one bootstrapping method, _bindEvents() initialises all functionality
   */
  _bindEvents () {
    this.$body.on('cart-refresh', () => {

      // Unbind then rebind event listeners
      this.shippingCalculator.reInit();
      this.couponCodes.reInit();
      this.giftCertificate.reInit();
      this.giftWrap.reInit();
    });

    const debounceTimeout = 400;
    const _cartUpdate = _.bind(_.debounce(this._cartUpdate, debounceTimeout), this);
    const _cartRemoveItem = _.bind(_.debounce(this._cartRemoveItem, debounceTimeout), this);

    // cart update
    this.$cartContent.on('click', '[data-cart-update]', (event) => {
      event.preventDefault();
      const $target = $(event.currentTarget);

      if(!$target.attr('disabled')){
        // update cart quantity
        $target.attr('disabled', 'disabled');
        _cartUpdate($target);
      }
    });

    this.$cartContent.on('click', '.cart-item-remove', (event) => {
      const itemId = $(event.currentTarget).data('item-id');

      event.preventDefault();
      // remove item from cart
      _cartRemoveItem(itemId);
    });
  }

  _cartUpdate ($target) {
    const itemId = $target.data('item-id');
    const $el = $(`#qty-${itemId}`);
    let oldQuantity = parseInt($el.val(), 10);

    this.overlayUtils.show();
    const newQuantity = $target.data('action') === 'increase' ? oldQuantity + 1 : oldQuantity - 1;

    utils.api.cart.itemUpdate(itemId, newQuantity, (err, response) => {

      if (response && response.data.status === 'succeed') {
        // if the quantity is changed "1" from "0", we have to remove the row.
        const remove = (newQuantity === 0);
        oldQuantity = newQuantity;
        this.refreshContent.refresh('both', remove);
      } else {
        $el.val(oldQuantity);
        this.errorAlert.open(response.data.errors, 'cart-update-error');
        $target.removeAttr('disabled');
        this.overlayUtils.hide();
      }
    });
  }

  _cartRemoveItem (itemId) {
    this.overlayUtils.show();
    utils.api.cart.itemRemove(itemId, (err, response) => {
      if (response.data.status === 'succeed') {
        this.refreshContent.refresh('both', true);
      } else {
        this.errorAlert.open(response.data.errors, 'cart-remove-error');
        this.overlayUtils.hide();
      }
    });
  }
}
