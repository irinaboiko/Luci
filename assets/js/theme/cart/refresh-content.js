import utils from '@bigcommerce/stencil-utils';
import OverlayUtils from '../global/overlay-utils';

export default class RefreshContent {
  constructor($els) {
    this.$body = $(document.body);

    this.overlayUtils = new OverlayUtils();
    this.$cartContent = $els.$cartContent;
    this.$cartTotals = $els.$cartTotals;
  }

  refresh(toUpdate, remove) {
    this.overlayUtils.show();
    const $cartItemsRows = this.$cartContent.find('[data-item-row]');

    // Remove last item from cart? Reload
    if (remove && $cartItemsRows.length === 1) {
      return window.location.reload();
    }

    let options = {};

    switch (toUpdate) {
      case 'content':
        options = {
          template: {
            content: 'cart/cart-content',
          },
        };
        break;
      case 'both':
      default:
        options = {
          template: {
            content: 'cart/cart-content',
            totals: 'cart/cart-totals',
          },
        };
        break;
    }

    utils.api.cart.getContent(options, (err, response) => {
      if (toUpdate === 'content') {
        this.$cartContent.html(response.content);
      } else if (toUpdate === 'totals') {
        this.$cartTotals.html(response.totals);
      } else {
        this.$cartContent.html(response.content);
        this.$cartTotals.html(response.totals);
      }

      this.overlayUtils.hide();
      this.$body.trigger('quick-cart-refresh').trigger('cart-refresh');
    });
  }
}
