import utils from '@bigcommerce/stencil-utils';
import RefreshContent from './refresh-content';
import OverlayUtils from '../global/overlay-utils';
import StateManager from '../global/state-manager';
import ErrorAlert from '../utils/error-alert';

export default class ShippingCalculator {
  constructor(context, $els) {
    this.overlayUtils = new OverlayUtils();

    this.$body = $(document.body);
    this.$cartContent = $els.$cartContent;
    this.$cartTotals = $els.$cartTotals;

    this.shippingForm = '[data-shipping-calculator]';
    this.shippingToggle = '.shipping-calculator-toggle';
    this.shippingQuote = '.select-shipping-quote';

    new StateManager({
      el: this.shippingForm,
      context,
      useIdForStates: true,
    });

    this.toggleActionText = {
      addInfo: context.addInfo,
      hideCalc: context.hideCalc,
    };

    this.refreshContent = new RefreshContent($els);
    this.errorAlert = new ErrorAlert();

    this.events = [];
    this.init();
  }

  init() {
    this.$calculator = $('.shipping-calculator');
    this.$calculatorForm = $(this.shippingForm);

    this._bindEvents();
  }

  reInit() {
    this.events.forEach($el => $el.off('.shipping-calculator'));
    this.events = [];

    this.init();
  }

  _bindEvents() {
    this.events = [
      this.$cartTotals.on('click.shipping-calculator', this.shippingToggle, (event) => {
        event.preventDefault();

        const $button = $(event.target);
        if (!$button.hasClass('disabled')) {
          this._toggleShipping($button);
        }
        $button.addClass('disabled');
      }),

      this.$cartTotals.on('submit.shipping-calculator', this.shippingForm, (event) => {
        event.preventDefault();
        this._calculateShipping();
      }),

      this.$cartTotals.on('click.shipping-calculator', this.shippingQuote, (event) => {
        event.preventDefault();
        this._setShippingCost();
      }),
    ];
  }

  _toggleShipping($button) {
    if (this.$calculator.hasClass('visible')) {
      // -- Hide Calculator -- //
      this.$calculator.revealer('hide').one('trend', () => {
        this.$calculator.addClass('hidden');
        let buttonText = this.toggleActionText.addInfo;
        if ($button.data('cost-default')) {
          buttonText = $button.data('cost-default');
        }
        $button.text(buttonText).removeClass('disabled');
      });
    } else {
      // -- Show Calculator -- //
      this.$calculator.removeClass('hidden').revealer('show').one('trend', () => {
        $button.text(this.toggleActionText.hideCalc).removeClass('disabled');
      });
    }
  }

  _calculateShipping() {
    this.overlayUtils.show();

    /* eslint-disable camelcase*/
    const params = {
      country_id: $('[name="shipping-country"]', this.$calculatorForm).val(),
      state_id: $('[name="shipping-state"]', this.$calculatorForm).val(),
      zip_code: $('[name="shipping-zip"]', this.$calculatorForm).val(),
    };

    utils.api.cart.getShippingQuotes(params, 'cart/cart-shipping-quotes', (err, response) => {
      if (err || response.data.errors) {
        this.errorAlert.open(response.data.errors, 'shipping-quote-response');
      } else {
        $('.shipping-quotes').html(response.content);
      }
      this.overlayUtils.hide();
    });
  }

  _setShippingCost() {
    this.overlayUtils.show();

    const quoteId = $('.shipping-quote:checked').val();

    utils.api.cart.submitShippingQuote(quoteId, (err, response) => {
      if (err || response.data.errors) {
        this.errorAlert.open(response.data.errors, 'shipping-cost-response');
        this.overlayUtils.hide();
      } else {
        this.refreshContent.refresh('totals', false);
      }
    });
  }
}
