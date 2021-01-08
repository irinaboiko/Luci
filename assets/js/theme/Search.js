import PageManager from '../PageManager';
import MasonryGrid from './components/masonry-grid';
import FacetedSearch from './components/faceted-search';

export default class Search extends PageManager {
  constructor() {
    super();

    this.$tab = $('[data-search-results-tab]');
    this.$content = $('[data-search-results-content]');

    this._setTab(0);
    this._bindEvents();
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

  _bindEvents() {
    this.$tab.on('click', (event) => {
      event.preventDefault();
      this._switchTab(event);
    });
  }

  /* eslint-disable camelcase*/
  _initializeFacetedSearch(context) {
    const requestOptions = {
      config: {
        product_results: {
          limit: context.productsPerPage,
        },
      },
      template: {
        productListing: 'search/product-listing',
        sideBar: 'search/sidebar',
      },
    };

    const containerSelectors = {
      productListing: '.product-grid-container',
      sideBar: '.search-sidebar',
    };

    const loadMore = {
      template: 'search/show-more',
    };

    new FacetedSearch(requestOptions, containerSelectors, context, loadMore);
  }

  _setTab(index) {
    if (this.$tab.length > 1) {
      this.$tab
        .eq(index)
        .addClass('active')
        .siblings()
        .removeClass('active')
        .parent().addClass('visible');

      this.$content
        .eq(index)
        .addClass('active')
        .siblings()
        .removeClass('active');
    }
  }

  _switchTab(event) {
    const $target = $(event.currentTarget);
    this._setTab($target.index());
  }
}
