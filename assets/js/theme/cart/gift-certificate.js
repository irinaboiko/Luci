import utils from '@bigcommerce/stencil-utils';
import RefreshContent from './refresh-content';
import OverlayUtils from '../global/overlay-utils';
import ErrorAlert from '../utils/error-alert';

export default class GiftCertificate {
  constructor(context, $els) {
    this.certificateText = {
      addCertificate: context.addCertificate,
      hideForm: context.hideForm,
      invalidCertificate: context.invalidCertificate,
    };
    this.overlayUtils = new OverlayUtils();
    this.refreshContent = new RefreshContent($els);
    this.errorAlert = new ErrorAlert();

    this.$cartTotals = $els.$cartTotals;

    this.events = [];
    this.init();
  }

  init() {
    this.$certificateForm = this.$cartTotals.find('.certificate-form');
    this.$certificateInput = this.$cartTotals.find('[name="certcode"]');

    this._bindEvents();
  }

  reInit() {
    this.events.forEach($el => $el.off('.gift-certificate'));
    this.events = [];

    this.init();
  }

  _bindEvents() {
    this.events = [
      $('.certificate-toggle').on('click.gift-certificate', (event) => {
        event.preventDefault();
        const $button = $(event.target);
        if (!$button.hasClass('disabled')) {
          this._toggleCertificateForm($button);
        }
        $button.addClass('disabled');
      }),

      this.$certificateForm.on('submit.gift-certificate', (event) => {
        event.preventDefault();
        this._applyCertificate();
      }),
    ];
  }

  _toggleCertificateForm($button) {
    if (this.$certificateForm.hasClass('visible')) {
      // -- Hide Certificate Form -- //
      this.$certificateForm.revealer('hide').one('trend', () => {
        this.$certificateForm.addClass('hidden');
        let buttonText = this.certificateText.addCertificate;
        if ($button.data('discount-default')) {
          buttonText = $button.data('discount-default');
        }
        $button.text(buttonText).removeClass('disabled');
      });
    } else {
      // -- Show Certificate Form -- //
      this.$certificateForm.removeClass('hidden').revealer('show').one('trend', () => {
        $button.text(this.certificateText.hideForm).removeClass('disabled');
      });
    }
  }

  _isValidCertificate(code) {
    if (typeof code !== 'string') {
      return false;
    }

    // Add any custom gift certificate validation logic here
    return true;
  }

  _applyCertificate() {
    this.overlayUtils.show();
    const code = this.$certificateInput.val();

    if (!code) {
      this.errorAlert.open(this.$certificateInput.data('error'), 'empty-certificate');
      return this.overlayUtils.hide();
    } else if (!this._isValidCertificate(code)) {
      this.errorAlert.open(this.certificateText.invalidCertificate, 'invalid-certificate');
      return this.overlayUtils.hide();
    }

    utils.api.cart.applyGiftCertificate(code, (error, response) => {
      if (error || response.data.errors) {
        this.errorAlert.open(response.data.errors, 'add-certificate-response');
        this.overlayUtils.hide();
      } else {
        this.refreshContent.refresh('totals', false);
      }
    });
  }
}
