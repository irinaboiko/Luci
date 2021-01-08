import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import Alert from '../components/Alert';
import productViewTemplates from './productViewTemplates';
import progressButton from './progressButton';
import initFormSwatch from '../core/formSelectedValue';
import OverlayUtils from '../global/overlay-utils';
import AttributesHelper from './attributes-helper';
import Wishlist from './wish-list';

export default class ProductUtils {
  constructor(el, context, imageSwitch = {}) {
    this.context = context;
    this.$body = $(document.body);
    this.$productBlock = $(el);
    this.$form = this.$productBlock.find('form[data-cart-item-add]');
    this.productTitle = this.$productBlock.data('product-title');
    this.productId = this.$productBlock.data('product-id');
    this.canPurchase = this.$productBlock.data('product-purchasable');
    this.productAttributesData = window.BCData.product_attributes;

    this.attributesHelper = new AttributesHelper(el);

    if (!this.productTitle) {
      this.productTitle = this.$productBlock.find('[data-product-title]').data('product-title');
    }
    if (!this.productId) {
      this.productId = this.$productBlock.find('[data-product-id]').data('product-id');
    }

    // two alert locations based on action
    this.cartAddAlert = new Alert(this.$productBlock.find('[data-product-cart-message]'));
    this.cartOptionAlert = new Alert(this.$productBlock.find('[data-product-option-message]'));

    // callback after product variation link has been appended
    this.imageSwitch = imageSwitch;
  }

  init() {
    const $productOptionsElement = $('[data-product-option-change]', this.$form);
    const hasOptions = $productOptionsElement.length > 0 ? true : false;
    const hasDefaultOptions = $productOptionsElement.find('[data-default]').length;

    if (hasDefaultOptions || (_.isEmpty(this.productAttributesData) && hasOptions)) {
      const $productId = $('[name="product_id"]', this.$form).val();
      utils.api.productAttributes.optionChange($productId, this.$form.serialize(), 'products/single-details', (err, response) => {

        const attributesData = response.data || {};
        const attributesContent = response.content || {};
        this.attributesHelper.updateAttributes(attributesData);
      });
    } else {
      this.attributesHelper.updateAttributes(this.productAttributesData);
    }

    this._bindProductOptions();
    this._bindCartSubmit();

    initFormSwatch();

    new Wishlist(this.$productBlock, this.context);
  }

  // -------------------------- Adding to Cart -------------------------- //

  /**
   * Run DOM manipulations on cart add
   */
  _bindCartSubmit() {
    utils.hooks.on('cart-item-add', (event, form) => {

      /*
       Do not do AJAX if:
        - Browser doesn't support FormData. No IE9.
        - Merchant has disabled ajax submission
      */
      if (window.FormData === undefined) {
        return;
      }

      event.preventDefault();

      const $button = this.$productBlock.find('.add-to-cart');
      const formData = new FormData(form);

      progressButton.progress($button);

      utils.api.cart.itemAdd(this.filterEmptyFilesFromForm(formData), (err, response) => {
        let isError = false;
        let message = response;

        if (err || response.data.error) {
          isError = true;
          message = err || response.data.error;
        }

        if (!isError && this.context.disableProductAjax) {
          window.location = this.context.cartUrl;
        }

        setTimeout(() => {
          this._updateMessage(isError, message);
          progressButton.complete($button);
        }, 500);
      });
    });
  }

  /**
   * Enable add to cart of product just given id
   * Needs to be a product with no options. Only one is added.
   * @param {jQuery} $buttons - a set of matched elements to be clicked,
     each with data-product-id and data-product-title attributes
   */
  static bindRemoteAdd(context, $buttons) {
    $buttons.on('click', (event) => {
      // Create an overlay when remotely adding to the cart
      new OverlayUtils().show();

      const quantity = 1;
      const $thisButton = $(event.currentTarget);
      const productId = $thisButton.data('product-id');
      const productTitle = $thisButton.data('product-title');

      // Do not do AJAX if browser doesn't support FormData. No IE9.
      if (window.FormData === undefined || !productId) { return; }

      event.preventDefault();

      progressButton.progress($thisButton);

      const formData = new FormData();
      formData.append('action', 'add');
      formData.append('product_id', productId);
      formData.append('qty', quantity);

      utils.api.cart.itemAdd(formData, (err, response) => {
        let message;

        if (err || response.data.error) {
          message = err || response.data.error;
        } else {
          message = context.messagesProductAddSuccessAlert.replace('*product*', productTitle);
        }

        if (context.disableProductAjax && !(err || response.data.error)) {
          return window.location = context.cartUrl;
        }

        $(document.body).trigger('quick-cart-refresh');

        setTimeout(() => {
          alert(message);
          progressButton.complete($thisButton);
        }, 500);
      });
    });
  }

  /**
   * On successful ajax cart add we want to clear all option inputs.
   *
   */
  _clearInputs() {
    const $inputs = this.$productBlock.find('[name^="attribute"]');

    $inputs.each((index, input) => {
      const $input = $(input);

      switch (input.type) {
        case 'checkbox':
          $input.prop('checked', false);
          break;
        case 'radio':
          $input.prop('checked', false);
          if ($input.hasClass('input-swatch')) {
            $input.parent('.form-label').removeClass('active');
          }
          break;
        case 'select':
          $input.val($input.find('[value]:first').val()); // reset selects to first selectable value
          break;
        default:
          $input.val('');
      }
    });
  }

  /**
   * Show feedback on cart button click.
   * @param {boolean} isError - was the cart submit an error or success?
   * @param {string} response - request response text from bigcommerce
   */
  _updateMessage(isError, response) {
    let message = '';

    if (isError) {
      message = response;
    } else {

      message = this.context.messagesProductAddSuccess;
      message = message
        .replace('*product*', this.productTitle)
        .replace('*cart_link*', `<a href='${this.context.urlsCart}'>${this.context.messagesCartLink}</a>`)
        .replace('*continue_link*', `<a href='${this.context.homeLink}'>${this.context.continueShopping}</a>`)
        .replace('*checkout_link*', `<a href='${this.context.urlsCheckout}'>${this.context.messagesCheckoutLink}</a>`);
    }

    this.cartAddAlert.message(message, (isError ? 'error' : 'success'), true);
  }

  // -------------------------- Product Options -------------------------- //

  /**
   * Build object of jQuery objects for easier(?) dom updating
   * @param {jQuery} $scope - the current product block.
   */
  _getViewModel($el) {
    return {
      $price: $('[data-product-price-wrapper="without-tax"]', $el),
      $priceWithTax: $('[data-product-price-wrapper="with-tax"]', $el),
      $saved: $('[data-product-price-saved]', $el),
      $sku: $('[data-product-sku]', $el),
      $weight: $('[data-product-weight]', $el),
      $addToCart: $('[data-button-purchase]', $el),
      $imagePreview: $('[data-variation-preview]', $el),
      $buttonText: $('.button-text', $el),
      stock: {
        $selector: $('[data-product-stock]', $el),
        $level: $('[data-product-stock-level]', $el),
      },
    };
  }

  _updateView(data) {
    const viewModel = this._getViewModel(this.$productBlock);

    if (viewModel.$sku.length) {
      viewModel.$sku.html(data.sku);
    }

    if (viewModel.$weight.length && data.weight) {
      viewModel.$weight.html(data.weight.formatted);
    }

    // if stock view is on (CP settings)
    if (viewModel.stock.$selector.length && data.stock) {

      viewModel.stock.$level.text(data.stock);
      // if the stock container is hidden, show
      if (viewModel.stock.$selector.hasClass('single-product-detail-hidden')) {
        viewModel.stock.$selector.removeClass('single-product-detail-hidden');
      }
    }

    if (viewModel.$price.length && _.isObject(data.price)) {
      const priceStrings = {
        price: data.price,
        excludingTax: this.context.productExcludingTax,
        salePriceLabel: this.context.salePriceLabel,
        nonSalePriceLabel: this.context.nonSalePriceLabel,
        retailPriceLabel: this.context.retailPriceLabel,
        priceLabel: this.context.priceLabel,
      };
      viewModel.$price.html(productViewTemplates.priceWithoutTax(priceStrings));
    }

    if (viewModel.$priceWithTax.length && _.isObject(data.price)) {
      const priceStrings = {
        price: data.price,
        includingTax: this.context.productIncludingTax,
      };
      viewModel.$priceWithTax.html(productViewTemplates.priceWithTax(priceStrings));
    }

    if (viewModel.$saved.length && _.isObject(data.price)) {
      const priceStrings = {
        price: data.price,
        savedString: this.context.productYouSave,
        salePriceLabel: this.context.salePriceLabel,
        nonSalePriceLabel: this.context.nonSalePriceLabel,
        retailPriceLabel: this.context.retailPriceLabel,
        priceLabel: this.context.priceLabel,
      };
      viewModel.$saved.html(productViewTemplates.priceSaved(priceStrings));
    }

    if (data.image) {
      const templateData = {
        src: utils.tools.image.getSrc(
          data.image.data,
          this.context.themeImageSizes.product
        ),
        previewLabel: this.context.productPreviewVariation,
      };

      if (this.imageSwitch) {
        viewModel.$imagePreview.html(productViewTemplates.variationPreviewImage(templateData));
        this.imageSwitch();
      }
    } else {
      viewModel.$imagePreview.empty();
    }

    this.cartOptionAlert.clear();

    let buttonText = this.context.productAddToCart;
    let buttonDisabled = false;

    if (!data.instock) {
      this.cartOptionAlert.error((data.purchasing_message || this.context.productOptionUnavailable), true);
      buttonDisabled = true;
      buttonText = this.context.productSoldOut;
    } else {
      if (viewModel.$addToCart.is('[data-button-preorder]')) {
        buttonText = this.context.productPreOrder;
      }

      buttonDisabled = false;
    }

    viewModel.$addToCart.prop('disabled', buttonDisabled);
    viewModel.$buttonText.text(buttonText);
  }

  /**
  * https://stackoverflow.com/questions/49672992/ajax-request-fails-when-sending-formdata-including-empty-file-input-in-safari
  * Safari browser with jquery 3.3.1 has an issue uploading empty file parameters. This function removes any empty files from the form params
  * @param formData: FormData object
  * @returns FormData object
  */
  filterEmptyFilesFromForm(formData) {
    try {
      for (const [key, val] of formData) {
        if (val instanceof File && !val.name && !val.size) {
          formData.delete(key);
        }
      }
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
    return formData;
  }

  _updateView(data) {
    const viewModel = this._getViewModel(this.$productBlock);

    if (viewModel.$sku.length) {
      viewModel.$sku.html(data.sku);
    }

    if (viewModel.$weight.length && data.weight) {
      viewModel.$weight.html(data.weight.formatted);
    }

    // if stock view is on (CP settings)
    if (viewModel.stock.$selector.length && data.stock) {

      viewModel.stock.$level.text(data.stock);
      // if the stock container is hidden, show
      if (viewModel.stock.$selector.hasClass('single-product-detail-hidden')) {
        viewModel.stock.$selector.removeClass('single-product-detail-hidden');
      }
    }

    if (viewModel.$price.length && _.isObject(data.price)) {
      const priceStrings = {
        price: data.price,
        savedString: this.context.productYouSave,
        salePriceLabel: this.context.salePriceLabel,
        nonSalePriceLabel: this.context.nonSalePriceLabel,
        retailPriceLabel: this.context.retailPriceLabel,
        priceLabel: this.context.priceLabel,
        includingTax: this.context.productIncludingTax,
        excludingTax: this.context.productExcludingTax,
      };
      viewModel.$price.html(productViewTemplates.priceWithoutTax(priceStrings));
    }

    if (viewModel.$priceWithTax.length && _.isObject(data.price)) {
      const priceStrings = {
        price: data.price,
        savedString: this.context.productYouSave,
        salePriceLabel: this.context.salePriceLabel,
        nonSalePriceLabel: this.context.nonSalePriceLabel,
        retailPriceLabel: this.context.retailPriceLabel,
        priceLabel: this.context.priceLabel,
        includingTax: this.context.productIncludingTax,
        excludingTax: this.context.productExcludingTax,
      };
      viewModel.$priceWithTax.html(productViewTemplates.priceWithTax(priceStrings));
    }

    if (viewModel.$saved.length && _.isObject(data.price)) {
      const priceStrings = {
        price: data.price,
        savedString: this.context.productYouSave,
        salePriceLabel: this.context.salePriceLabel,
        nonSalePriceLabel: this.context.nonSalePriceLabel,
        retailPriceLabel: this.context.retailPriceLabel,
        priceLabel: this.context.priceLabel,
        includingTax: this.context.productIncludingTax,
        excludingTax: this.context.productExcludingTax,
      };
      viewModel.$saved.html(productViewTemplates.priceSaved(priceStrings));
    }

    if (data.image) {
      const templateData = {
        src: utils.tools.image.getSrc(
          data.image.data,
          this.context.themeImageSizes.product
        ),
        previewLabel: this.context.productPreviewVariation,
      };

      if (this.imageSwitch) {
        viewModel.$imagePreview.html(productViewTemplates.variationPreviewImage(templateData));
        this.imageSwitch();
      }
    } else {
      viewModel.$imagePreview.empty();
    }

    this.cartOptionAlert.clear();

    let buttonText = this.context.productAddToCart;
    let buttonDisabled = false;

    if (!data.instock) {
      this.cartOptionAlert.error((data.purchasing_message || this.context.productOptionUnavailable), true);
      buttonDisabled = true;
      buttonText = this.context.productSoldOut;
    } else {
      if (viewModel.$addToCart.is('[data-button-preorder]')) {
        buttonText = this.context.productPreOrder;
      }

      buttonDisabled = false;
    }

    viewModel.$addToCart.prop('disabled', buttonDisabled);
    viewModel.$buttonText.text(buttonText);

    this._setProductVariant();
  }

  /**
   * Run DOM manipulation on product options change.
   */
  _bindProductOptions() {
    utils.hooks.on('product-option-change', (event, currentTarget) => {
      // const $form = this.$productBlock.find('[data-cart-item-add]');
      const $form = $('form[data-cart-item-add]', this.$productBlock);


      this.cartOptionAlert.clear();

      utils.api.productAttributes.optionChange(this.productId, $form.serialize(), 'products/single-details', (err, response) => {
        this.cartAddAlert.clear();
        console.log('err', err);
        console.log('response', response);

        const productAttributesData = response.data || {};
        const productAttributesContent = response.content || {};

        if (this.$productBlock.find('[data-product-options-count]').val < 1) {
          return;
        }

        this.attributesHelper.updateAttributes(productAttributesData);
        this._updateView(productAttributesData);
      });
    });
  }

  _setProductVariant() {
    const unsatisfiedRequiredFields = [];
    const options = [];

    $.each($('[data-product-attribute]'), (index, value) => {
      const optionLabel = value.children[0].innerText;
      const optionTitle = optionLabel.split(':')[0].trim();
      const required = optionLabel.toLowerCase().includes('required');
      const type = value.getAttribute('data-product-attribute');

      if ((type === 'input-file' || type === 'input-text' || type === 'input-number') && value.querySelector('input').value === '' && required) {
        unsatisfiedRequiredFields.push(value);
      }

      if (type === 'textarea' && value.querySelector('textarea').value === '' && required) {
        unsatisfiedRequiredFields.push(value);
      }

      if (type === 'date') {
        const isSatisfied = Array.from(value.querySelectorAll('select')).every((select) => select.selectedIndex !== 0);

        if (isSatisfied) {
          const dateString = Array.from(value.querySelectorAll('select')).map((x) => x.value).join('-');
          options.push(`${optionTitle}:${dateString}`);

          return;
        }

        if (required) {
          unsatisfiedRequiredFields.push(value);
        }
      }

      if (type === 'set-select') {
        const select = value.querySelector('select');
        const selectedIndex = select.selectedIndex;

        if (selectedIndex !== 0) {
          options.push(`${optionTitle}:${select.options[selectedIndex].innerText}`);

          return;
        }

        if (required) {
          unsatisfiedRequiredFields.push(value);
        }
      }

      if (type === 'set-rectangle' || type === 'set-radio' || type === 'swatch' || type === 'input-checkbox' || type === 'product-list') {
        const checked = value.querySelector(':checked');
        if (checked) {
          if (type === 'set-rectangle' || type === 'set-radio' || type === 'product-list') {
            const label = checked.labels[0].innerText;
            if (label) {
              options.push(`${optionTitle}:${label}`);
            }
          }

          if (type === 'swatch') {
            const label = checked.labels[0].children[0];
            if (label) {
              options.push(`${optionTitle}:${label.title}`);
            }
          }

          if (type === 'input-checkbox') {
            options.push(`${optionTitle}:Yes`);
          }

          return;
        }

        if (type === 'input-checkbox') {
          options.push(`${optionTitle}:No`);
        }

        if (required) {
          unsatisfiedRequiredFields.push(value);
        }
      }
    });

    let productVariant = unsatisfiedRequiredFields.length === 0 ? options.sort().join(', ') : 'unsatisfied';
    const view = $('.product-area');

    if (productVariant) {
      productVariant = productVariant === 'unsatisfied' ? '' : productVariant;
      if (view.attr('data-event-type')) {
        view.attr('data-product-variant', productVariant);
      } else {
        const productName = view.find('[data-product-title]')[0].innerText.replace(/"/g, '\\$&');
        const card = $(`[data-name="${productName}"]`);
        card.attr('data-product-variant', productVariant);
      }
    }
  }
}
