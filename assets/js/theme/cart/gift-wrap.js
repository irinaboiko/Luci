import utils from '@bigcommerce/stencil-utils';
import OverlayUtils from '../global/overlay-utils';
import SelectWrapper from '../global/select-wrapper';
import ErrorAlert from '../utils/error-alert';
import Modal from 'bc-modal';

export default class GiftWrap {
  constructor() {
    this.overlayUtils = new OverlayUtils();
    this.imagePreviewModals = {};
    this.errorAlert = new ErrorAlert();

    this.events = [];
    this.init();
  }

  init() {
    this.$form = $('.gift-wrap-form');
    this.$select = this.$form.find('select');
    this.$toggle = $('.item-gift-wrap-toggle');
    this.$previewToggle = $('.gift-wrap-image-toggle');

    this._bindEvents();
  }

  reInit() {
    this.events.forEach($el => $el.off('.gift-wrap'));
    this.events = [];

    this.init();
  }

  _bindEvents() {
    this.events = [
      this.$toggle.on('click.gift-wrap', (event) => {
        event.preventDefault();
        this._showForm(event);
      }),

      this.$select.on('change.gift-wrap', (event) => {
        this._toggleGiftWrapDetails(event);
      }),

      this.$previewToggle.on('click.gift-wrap', (event) => {
        this._showPreviewImage(event);
      }),

      $('[name="giftwraptype"]').on('click.gift-wrap', (event) => {
        this._toggleViews(event);
      }),
    ]
  }

  _showForm(event) {
    const $target = $(event.currentTarget);
    const itemId = $target.data('item-gift-wrap');
    const options = {
      template: 'cart/gift-wrap/gift-wrap-form',
    };

    this.overlayUtils.show();

    utils.api.cart.getItemGiftWrappingOptions(itemId, options, (error, response) => {

      if (error || response.data.errors) {
        this.errorAlert.open(response.data.errors, 'gift-wrapping-response');
      } else {
        $('.gift-wrap-form').remove();
        $('.item-gift-wrap-add').addClass('visible');
        $(`.gift-wrap-form-wrapper[data-item-id=${itemId}]`).html(response.content).removeClass('hidden').revealer('show');
        $target.removeClass('visible');

        this.init();

        this.$select.each((i) => {
          const $select = this.$select.eq(i);
          new SelectWrapper($select);
          this._toggleGiftWrapDetails(null, $select);
        });
      }

      this.overlayUtils.hide();
    });
  }

  _toggleGiftWrapDetails(event, $el) {
    const $select = (event) ? $(event.currentTarget) : $el;
    const $option = $select.find('option:selected');
    const index = $select.data('index');
    const id = $select.val();

    const wrapping = {
      field: $select.closest('.form-field'),
      image: id ? $option.data('preview-image') : false,
      message: id ? $option.data('allow-message') : false,
    };

    if (wrapping.message) {
      wrapping.field.siblings(`[data-gift-wrap-message=${index}]`).addClass('visible');
    } else {
      wrapping.field.siblings(`[data-gift-wrap-message=${index}]`).removeClass('visible');
    }

    if (wrapping.image) {
      wrapping.field.find('.gift-wrap-image-toggle').addClass('visible').data('id', id);
    } else {
      wrapping.field.find('.gift-wrap-image-toggle').removeClass('visible');
    }
  }

  _toggleViews(event) {
    const $target = $(event.currentTarget);
    const $targetContainer = $target.closest('.gift-wrap-form');
    const value = $targetContainer.find('input:radio[name="giftwraptype"]:checked').val();
    const $singleForm = $targetContainer.find('.gift-wrap-single');
    const $multiForm = $targetContainer.find('.gift-wrap-multiple');

    if (value === 'same') {
      $singleForm.addClass('visible');
      $multiForm.removeClass('visible');
    } else {
      $singleForm.removeClass('visible');
      $multiForm.addClass('visible');
    }
  }

  _showPreviewImage(event) {
    const $target = $(event.currentTarget);
    const id = $target.data('id');

    if (!this.imagePreviewModals[id]) {
      this.imagePreviewModals[id] = new Modal({
        el: $(`.gift-wrap-image-wrapper[data-id=${id}]`),
      });
    }

    this.imagePreviewModals[id].open();
  }
}
