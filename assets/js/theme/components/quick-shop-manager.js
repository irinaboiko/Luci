import baguetteBox from 'baguettebox.js';
import utils from '@bigcommerce/stencil-utils';
import ProductUtils from '../product/product-utils';
import ProductSlideshow from '../product/product-slideshow';
import SelectWrapper from '../global/select-wrapper';
import Modal from 'bc-modal';

export default class QuickShopManager {
  constructor(context) {
    this.context = context;
    this.$body = $(document.body);

    this.id = null;
    this.$spinner = $('<span class="page-spinner"></span>');
    this.$modal = {};

    this.QuickShopModal = new Modal({
      el: $('<div id="quick-shop-modal">'),
      modalClass: 'modal-quick-shop',
      bodyOverflowClass: 'modal-locked',
      afterShow: ($modal) => {
        this.$modal = $modal;
        this._modalLoadingState(this.$modal);
        this._fetchProduct(this.id);
      },
    });

    this._bindEvents();
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

  _bindEvents() {
    this.$body.on('click', '.quick-shop-trigger', (event) => {
      event.preventDefault();
      this.$modal = {};
      this.id = $(event.currentTarget).data('product-id');

      if (!this.id) {
        return;
      }

      this.QuickShopModal.open();
    });
  }

  /**
   * Run ajax fetch of product and add to modal. Bind product functionality and show the modal
   * @param {integer} id - product id
   */
  _fetchProduct(id) {
    utils.api.product.getById(id, {template: 'products/quick-shop'}, (err, response) => {

      this.$modal.toggleClass('loading');
      this.$modal.find('.modal-content').append(response);

      this._initProduct();
    });
  }

  _initProduct() {
    if($('[data-quickshop-slideshow]').length){
      new ProductSlideshow('[data-quickshop-slideshow]', this.context);
    }
    const $select = $('select', this.$modal);

    if ($select.length) {
      $select.each((i) => {
        new SelectWrapper($select.eq(i));
      });
    }

    // Init FB like if necessary
    if (this.$modal.find('[data-facebook-like]').length < 1) {
      (function(d, s, id) {
        //eslint-disable-next-line one-var, no-var
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }

    this.productUtils = new ProductUtils(this.$modal, this.context, this._bindVariationImgPreview.bind(this));
    this.productUtils.init();

    this.QuickShopModal.position();

    this.$modal.toggleClass('loading').toggleClass('loaded');
    this._modalLoadingState(this.$modal, false);
  }

  // bind lightbox for dynamically added product variant image
  _bindVariationImgPreview() {
    baguetteBox.run('[data-variation-preview]', {});
  }
}
