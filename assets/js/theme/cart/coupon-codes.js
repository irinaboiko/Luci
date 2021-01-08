import utils from '@bigcommerce/stencil-utils';
import RefreshContent from './refresh-content';
import OverlayUtils from '../global/overlay-utils';
import ErrorAlert from '../utils/error-alert';

export default class CouponCodes {
  constructor(context, $els) {
    this.toggleActionText = {
      addCode: context.addCode,
      hideCoupons: context.hideCoupons,
    };
    this.overlayUtils = new OverlayUtils();
    this.refreshContent = new RefreshContent($els);
    this.errorAlert = new ErrorAlert();

    this.$cartTotals = $els.$cartTotals;

    this.events = [];
    this.init();
  }

  init() {
    this.$couponForm = this.$cartTotals.find('.coupon-code-form');
    this.$codeInput = this.$cartTotals.find('[name="couponcode"]');

    this._bindEvents();
  }

  reInit() {
    this.events.forEach($el => $el.off('.coupon-codes'));
    this.events = [];

    this.init();
  }

  _bindEvents() {
    $('.coupon-code-toggle').on('click.coupon-codes', (event) => {
      event.preventDefault();
      const $button = $(event.target);
      if (!$button.hasClass('disabled')) {
        this._toggleCouponForm($button);
      }
      $button.addClass('disabled');
    });

    this.$couponForm.on('submit.coupon-codes', (event) => {
      event.preventDefault();
      this._addCoupon();
    });
  }

  _toggleCouponForm($button) {
    if (this.$couponForm.hasClass('visible')) {
      // -- Hide Coupon Form -- //
      this.$couponForm.revealer('hide').one('trend', () => {
        this.$couponForm.addClass('hidden');
        let buttonText = this.toggleActionText.addCode;
        if ($button.data('discount-default')) {
          buttonText = $button.data('discount-default');
        }
        $button.text(buttonText).removeClass('disabled');
      });
    } else {
      // -- Show Coupon Form -- //
      this.$couponForm.removeClass('hidden').revealer('show').one('trend', () => {
        $button.text(this.toggleActionText.hideCoupons).removeClass('disabled');
      });
    }
  }

  _addCoupon() {
    this.overlayUtils.show();
    const code = this.$codeInput.val();

    if (!code) {
      this.errorAlert.open(this.$codeInput.data('error'), 'add-coupon');
      return this.overlayUtils.hide();
    }

    utils.api.cart.applyCode(code, (error, response) => {
      if (response.error || response.data.errors) {
        const errorMessage = response.error ? response.message : response.data.errors;

        this.errorAlert.open(errorMessage, 'add-coupon-response');
        this.overlayUtils.hide();
      } else {
        this.refreshContent.refresh('totals', false);
      }
    });
  }
}
