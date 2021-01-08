import Alert from '../components/Alert';
import Url from 'url';

export default class Wishlist {
  constructor($el, context) {
    this.context = context;
    this.$el = $el;
    this.$wishlistModal = $('[data-wishlist-modal]');
    this.$wishlistForm = $('[data-wishlist-form]', this.$wishlistModal);
    this.$wishlistListForm = $('[data-wishlist-list-form]', this.$wishlistModal);
    this.title = this.$el.data('product-title');
    this.productId = $('[data-product-id]', this.$el).val();
    this.url = Url.parse(location.href, true);
    this.wishlistName = this.url.query['wishlistName'] ? this.url.query['wishlistName'] : '';
    this.wishlistAlert = new Alert($('[data-product-wishlist-message]'));
    this.$spinner = $('<span class="page-spinner"></span>');

    /*
     * Show the wishlist success message on page load if need be.
     *
     * We have to reload the page when a wishlist is created inline on the
     * product page because of the lack of a wishlist Api
     */
     if (this.wishlistName) {
      this._wishlistSuccessMessage(this.title, this.wishlistName);
    }

    this._bindEvents();
  }

  _bindEvents() {
    $(document.body).on('submit', '[data-wishlist-form]', (event) => {
      if(this.context.customerID) {
        event.preventDefault();

        this._submitCreateWishlist(event);
      }
    });

    $(document.body).on('click', '[data-wishlist-button]', (event) => {
      const $button = $(event.currentTarget);
      const $modal = $button.siblings('[data-wishlist-modal]');

      $modal.revealer('show');
    })

    $(document.body).on('click', '[data-wishlist-modal] .modal-close', (event) => {
      this._closeModal();
    })

    this._bindAddWishlist();
  }

  _bindAddWishlist() {
    $('input:radio[name="product-wishlist"]').on('change', (event) => {
      event.preventDefault();
      this._modalLoadingState(this.$wishlistModal);

      const $radioChecked = this.$wishlistListForm.find('input[type="radio"]:checked');
      const addUrl = $radioChecked.val();
      const name = $radioChecked.attr('id');

      $.ajax({
        type: 'POST',
        url: addUrl,
        success: () => {
          this._wishlistSuccessMessage(this.title, name)
        },
        error: () => {
          this.wishlistAlert.error(this.context.messagesWishlistAddError.replace('*product*', this.title), true);
        },
        complete: () => {
          this._closeModal();
        },
      });
    });
  }

  _submitCreateWishlist(event) {
    this._modalLoadingState(this.$wishlistModal);

    const $wishlistForm = $(event.currentTarget);
    const url = $wishlistForm[0].action;
    const data = $wishlistForm.serialize();
    const name = $('input[name="wishlistname"]', $wishlistForm).val();
    const currentUrl = Url.parse(location.href);

    $.ajax({
      type: 'POST',
      url: url,
      data: data,
      success: (res) => {
        const queryParams = `wishlistName=${name}`;

        this._wishlistSuccessMessage(this.title, name);

        this._goToUrl(
          Url.format(
            { pathname: currentUrl.pathname, search: '?' + queryParams }
          )
        );
        location.reload();
        this._closeModal();
      }, error: (error) => {
        this.wishlistAlert
          .error(
            this.context.messagesWishlistAddError.replace('*product*', this.title), true
          );
        this._closeModal();
      },
    });
  }

  _wishlistSuccessMessage (product, wishlist) {
    this.wishlistAlert
      .success(this.context.messagesWishlistAddSuccess
      .replace('*product*', product)
      .replace('*name*', wishlist), true)
    ;
  }

  _resetForm() {
    this.$wishlistForm.trigger('reset');
  }

  _closeModal() {
    this._resetForm();
    console.log(this.$wishlistModal);
    this.$wishlistModal
      .removeClass('loading')
      .revealer('hide')
      .find(this.$spinner)
      .remove()
  }

  _goToUrl(url) {
    History.pushState({}, document.title, url);
  }

  /**
   * Show spinner
   */
  _modalLoadingState($modal) {
    $modal
      .addClass('loading')
      .append(this.$spinner);
  }
}
