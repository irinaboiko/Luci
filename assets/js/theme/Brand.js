import PageManager from '../PageManager';
import MasonryGrid from './components/masonry-grid';
import FacetedSearch from './components/faceted-search';

export default class Brands extends PageManager {
  constructor() {
    super();
  }

  loaded(next) {
    if ($('.faceted-search').length) {
      this._initializeFacetedSearch(this.context);
    }

    if ($('body').data('layout') === "masonry-grid") {
      const layout = new MasonryGrid();
      layout.init();
    }

    next();
  }

  /* eslint-disable camelcase*/
  _initializeFacetedSearch(context) {
    const requestOptions = {
      config: {
        category: {
          shop_by_brand: true,
          products: {
            limit: context.productsPerPage,
          },
        },
      },
      template: {
        productListing: 'brand/product-listing',
        sideBar: 'brand/sidebar',
      },
    };

    const containerSelectors = {
      productListing: '.product-grid-container',
      sideBar: '.collection-sidebar',
    };

    const loadMore = {
      template: 'brand/show-more',
    };

    new FacetedSearch(requestOptions, containerSelectors, context, loadMore);
  }
}
