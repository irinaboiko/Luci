import _ from 'lodash';

export default class ProductCompare {
  constructor(context) {
    this.context = context;

    this.$body = $(document.body);

    this.compareActive = false;
    this.maxItems = 4;

    this.compareIndex = []; // ordered array of product ids
    this.compareItems = {}; // object of currently selected products

    this.$compareBarBase = `<form class='compare-bar' method='post' data-compare-bar>
    <div class='compare-bar-internal'></div>
    <div class='compare-bar-actions'>
      <input class='compare-bar-submit button button-primary' type='submit' value='${this.context.compareCompareProducts}'>
      <input class='compare-bar-clear button button-secondary' type='button' value='${this.context.compareClearSelection}'>
      </div>
    </form>`;

    this.itemTemplate = _.template(`
      <div class="product-compare-item">
        <button class='compare-item-remove' data-remove-id='<%= id%>'><i class='icon-remove'></i></button>
        <input type="hidden" value="<%= id %>" name="products[]">
        <div class='product-compare-item-thumbnail'>
          <%= img %>
        </div>
      </div>
    `);

    this._bindEvents();
  }

  _bindCompareBar() {
    this.$compareBar = $('[data-compare-bar]');
    this.$compareBarInternal = this.$compareBar.find('.compare-bar-internal');
    this.$compareSubmit = this.$compareBar.find('.compare-bar-submit');
    this.$compareBar.attr('action', $('[data-product-compare]').attr('action'));

    // remove item from click within tab
    this.$compareBar.on('click', '.compare-item-remove', (event) => {
      event.preventDefault();
      const productId = parseInt($(event.currentTarget).data('remove-id'), 10);

      this._removeCompareItemById(productId);
      this._updateCompareState();
    });

    // remove all items
    this.$compareBar.on('click', '.compare-bar-clear', (event) => {
      event.preventDefault();

      this._removeAllItems();
    });
  }

  _bindEvents() {
    $('[data-product-compare]').on('change', (event) => {
      // cancel if it's not a checkbox that triggered the change event
      if (event.target.type !== 'checkbox') {
        return;
      }

      const $checkbox = $(event.target);
      const $product = $checkbox.closest('.product-item');
      const productId = parseInt($checkbox.val(), 10);
      const productData = this._getProductData($product, productId);

      let state = 'hide';

      if (productId in this.compareItems) {
        this._removeCompareItemById(productId);
      } else {
        state = 'show';
        this._addCompareItem(productData);

        // if we're at the max number of items, remove the first item
        if (this.compareIndex.length > this.maxItems) {
          this._removeCompareItemByIndex(0);
        }
      }

      this._updateCompareState(state);
    });
  }

  /**
   * create an object of relevant product data from product element.
   * @param $product {jQuery} - product item object
   * @param productId {number} - ID of product
   * @returns {object}
   */
  _getProductData($product, productId) {
    let img;
    if ($product.find('.product-item-thumbnail img').length) {
      const imgSrc = $product.find('.product-item-thumbnail img').attr('src');
      img = `<div class='product-compare-item-image' style='background-image:url(${imgSrc});'></div>`;
    } else {
      img = $product.find('.product-item-thumbnail a').html();
    }

    return {
      id: productId,
      img,
      title: $product.find('.product-item-title a').text(),
    };
  }

  // ---------------------- Handle popup compare tab changes --------------------- //

  /**
   * Decide what to do with the compare tab on each update
   */
  _updateCompareState() {
    if (!this.compareActive) {
      this._initCompare();
    } else if (this.compareIndex.length === 0) {
      this._destroyCompare();
    } else {
      this._refreshCompare();
    }
  }

  /**
   * Show compare tab
   */
  _initCompare() {
    if (!this.$compareBar) {
      this.$body.append(this.$compareBarBase);
      this._bindCompareBar();
    }
    this._refreshCompare();

    this.$compareBar.revealer('show');
    this.compareActive = true;
  }

  /**
   * Hide compare tab
   */
  _destroyCompare() {
    this.$compareBar.revealer('hide');
    this.compareActive = false;
  }

  /**
   * Regenerate markup based on currently active items
   */
  _refreshCompare() {
    const items = [];
    this.compareIndex.forEach((id) => {
      items.push(this.itemTemplate(this.compareItems[id]));
    });

    // enable/disable button
    this.$compareSubmit.attr('disabled', this.compareIndex.length < 2);

    this.$compareBarInternal.html(items.join(''));
  }


  // ---------------------- Adding & removing compare items --------------------- //

  /**
   * append product to end of compared products list
   * @param productData {object} - object containing product id, title and image
   */
  _addCompareItem(productData) {
    this.compareIndex.push(productData.id);
    this.compareItems[productData.id] = productData;
  }

  /**
   * remove product from compared products list
   * @param productId {number} - ID of product we want to remove
   */
  _removeCompareItemById(productId) {
    _.pull(this.compareIndex, productId);
    delete this.compareItems[productId];

    this._uncheckCompare(productId);
  }

  /**
   * remove product from compared products list
   * @param index {number} - index within compared product list of product we want to remove
   */
  _removeCompareItemByIndex(index) {
    const productId = this.compareIndex[index];
    this.compareIndex.splice(index, 1);
    delete this.compareItems[productId];

    this._uncheckCompare(productId);
  }

  /**
   * Remove all items from compare tab and reset to default state
   *
   */
  _removeAllItems() {
    this.compareIndex.forEach((id) => {
      this._uncheckCompare(id);
    });

    this.compareIndex = [];
    this.compareItems = {};

    this._updateCompareState();
  }

  /**
   * Uncheck a compare checkbox
   * @param id {number} - id of product within grid to be unchecked
   */
  _uncheckCompare(id) {
    $(`#compare-${id}`).prop('checked', false);
  }

}
