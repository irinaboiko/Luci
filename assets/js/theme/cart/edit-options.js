import utils from '@bigcommerce/stencil-utils';
import Modal from 'bc-modal';
import AttributesHelper from '../product/attributes-helper';
import SelectWrapper from '../global/select-wrapper';

export default class CartEditOptions {
  constructor(context) {
    this.context = context;
    this.el = '.cart-options-modal';
    this.$el = $('body').find(this.el);
    this.id = null;
    this.$spinner = $('<span class="page-spinner"></span>');

    this.cartOptionsModal = new Modal({
      el: this.$el,
      modalClass: 'cart-options-modal',
      afterShow: ($modal) => {
        this.$modal = $modal;
        this._modalLoadingState(this.$modal);
        this._fetchProduct($modal, this.id);
      },
    });

    // Abstracted attributes functionality
    this.attributesHelper = new AttributesHelper('#CartEditProductFieldsForm');

    this._bindEvents();
  }

  _bindEvents() {
    $('body').on('click', '[data-item-edit]', (event) => {
      event.preventDefault();

      this.id = $(event.currentTarget).data('item-edit');

      if (!this.id) { return; }

      this.cartOptionsModal.open();
    });

    $('body').on('submit', '#CartEditProductFieldsForm', () => {
      this.$modal.toggleClass('loading').toggleClass('loaded');
      this._modalLoadingState(this.$modal);
    });
  }

  /**
 * Show spinner
 */
  _modalLoadingState($modal, show = true) {
    if (show) {
      $modal.append(this.$spinner);
    } else {
      $modal.find(this.$spinner).remove();
    }
  }

  /**
   * Run ajax fetch of product and add to modal. Bind product functionality and show the modal
   * @param {jQuery} $modal - the root (appended) modal element.
   * @param {string} $itemId - product id
   */
  _fetchProduct($modal, $itemID) {
    const options = {
      template: 'cart/edit-options',
    };

    utils.api.productAttributes.configureInCart($itemID, options, (err, response) => {
      $modal
        .find('.modal-content')
        .append(response.content)
        .find('.cart-edit-options')
        .addClass('cart-edit-options-visible');

      this.cartOptionsModal.position();
      $modal.addClass('loaded');

      const $select = $modal.find('select');
      if ($select.length) {
        $select.each((i, el) => {
          new SelectWrapper(el);
        });
      }

      utils.hooks.on('product-option-change', (event, option) => {
        this.$modal.toggleClass('loading').toggleClass('loaded');
        this._modalLoadingState(this.$modal);
        const $changedOption = $(option);
        const $form = $('#CartEditProductFieldsForm');
        const $submit = $('input[type="submit"]', $form);
        const $messageBox = $('[data-reconfigure-errors]');
        const item = $('[name="item_id"]', $form).attr('value');

        utils.api.productAttributes.optionChange(item, $form.serialize(), 'products/single-details', (err, result) => {
          const data = result.data || {};

          this.attributesHelper.updateAttributes(data);

          if (data.purchasing_message) {
            $($messageBox).html(data.purchasing_message);
            $submit.prop('disabled', true);
            $messageBox.show();
          } else {
            $submit.prop('disabled', false);
            $messageBox.hide();
          }

          if (!data.purchasable || !data.instock) {
            $submit.prop('disabled', true);
          } else {
            $submit.prop('disabled', false);
          }

          this.$modal.removeClass('loading').addClass('loaded');
          this._modalLoadingState(this.$modal, false);
        })
      });

      utils.hooks.emit('product-option-change');
    })
  }
}
