import { hooks, api } from '@bigcommerce/stencil-utils';
import _ from 'lodash';
import Url from 'url';
import 'history.js/scripts/bundled/html4+html5/jquery.history';
import MasonryGrid from './masonry-grid';
import ThemeUtilities from '../global/theme-utilities';
import SelectWrapper from '../global/select-wrapper';

export default class FacetedSearch {
  constructor(requestOptions, containerSelectors, context, loadMore) {
    this.context = context;
    this.requestOptions = requestOptions;
    this.containerSelectors = containerSelectors;
    this.loadMore = loadMore;
    this.layoutSetup = new MasonryGrid();
    this.themeUtilities = new ThemeUtilities(this.context);
    this.$gridLayout = $('body').data('layout');

    this.options = {
      blocker: '.loading-overlay',
      filterToggle: '.faceted-search-toggle',
      filterToggleOpen: '.faceted-search-toggle.is-open',
      moreToggle: '[data-additional-facets]',
    };

    this._bindEvents();
  }

  _bindEvents() {
    const debounceTimeout = 400;
    const _mobileFilterToggle = _.bind(_.debounce(this._mobileFilterToggle, debounceTimeout), this);

    if (this.$gridLayout === "masonry-grid") {
      this.layoutSetup.init();
    }


    this._mobileFilterToggle();


    $(document.body).on('click', this.options.filterToggle, (event) => {
      this._toggleFilter($(event.currentTarget));
    });

    $(document.body).on('click', this.options.moreToggle, (event) => {
      this._showAdditionalFilters(event);
    });

    $(window).on('statechange', this._onStateChange.bind(this));

    $(window).on('resize', () => {
      _mobileFilterToggle();
    });

    hooks.on('facetedSearch-facet-clicked', this._onFacetClick.bind(this));
    hooks.on('facetedSearch-range-submitted', this._onRangeSubmit.bind(this));
    hooks.on('sortBy-submitted', this._onSortBySubmit.bind(this));

  }

  _mobileFilterToggle() {
    if (this.themeUtilities.deviceSize('large', 'lessThan')) {

      const $openFilters = $(this.options.filterToggleOpen);
      for (let i = 0; i < $openFilters.length; i++) {
        this._toggleFilter($openFilters.eq(i));
      }

    } else {

      const $defaultFilters = $('[data-default-visible]');
      for (let i = 0; i < $defaultFilters.length; i++) {
        if (!$defaultFilters.eq(i).hasClass('is-open')) {
          this._toggleFilter($defaultFilters.eq(i));
        }
      }

    }
  }

  _showAdditionalFilters(event) {
    //Show/hide extra facets based on settings for product filtering
    event.preventDefault();

    const $toggle = $(event.currentTarget);
    const facet = $toggle.data('additional-facets');
    const $navList = $(`[data-facet-name="${facet}"]`);
    const $container = $navList.parent('.faceted-search-filter-list');
    const containerHeight = $container.height();
    const facetUrl = `${window.location.origin}${window.location.pathname}`;
    const blocker = false;

    const options = {
      template: this.loadMore.template,
      params: {
        list_all: facet,
      },
    };

    if (window.location.search) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);

      for (const [key, value] of urlParams) {
        options.params[key] = value
      }
    }

    $container
      .css('min-height', containerHeight)
      .toggleClass('animating');

    if (!$toggle.siblings('[data-additional-facets-list]').length) {
      $(document.body).addClass('scroll-locked');
      $(this.options.blocker).addClass('visible');

      const blocker = true;

      api.getPage(facetUrl, options, (err, response) => {
        if (err) {
          throw new Error(err);
        }

        $(response).insertAfter($navList);
        this._toggleFacetLists({ $container, $navList, $toggle, blocker });
      });
    } else {
      this._toggleFacetLists({ $container, $navList, $toggle, blocker });
    }

    return false;
  }

  _toggleFacetLists($els) {
    const { $container, $navList, $toggle, blocker } = $els;

    // Hide original list
    $navList.toggle();

    // Toggle new list
    $container
      .find('[data-additional-facets-list]')
      .toggle();

    // Reset list
    $container
      .css('min-height', '')
      .toggleClass('animating');

    // Toggle more/less link
    $toggle.children().toggle();

    if (blocker) {
      $(document.body).removeClass('scroll-locked');
      $(this.options.blocker).removeClass('visible');
    }
  }


  _toggleFilter($target) {

    $target
      .parents('.faceted-search-filter')
      .children('.faceted-search-filter-list')
      .toggleClass('is-open');

    $target.toggleClass('is-open');

    if ($target.hasClass('is-open')) {
      $target.html('&ndash;');
    } else {
      $target.text('+');
    }

  }

  _onFacetClick(event, target) {
    event.preventDefault();

    const $target = $(target);
    const url = $target.attr('href');

    $target.children('.icon:not(.icon-star)').toggleClass('icon-checked icon-unchecked');

    this._goToUrl(url);
  }

  _onRangeSubmit(event, target) {
    event.preventDefault();

    const url = Url.parse(location.href);
    let queryParams = $(target).serialize();

    if ($(document.body).hasClass('template-search')) {
      const currentSearch = `search_query=${$('[data-search-query]').data('search-query')}` || '';
      queryParams = `${currentSearch}&${queryParams}`;
    }

    this._goToUrl(Url.format({ pathname: url.pathname, search: `?${queryParams}` }));
  }

  _onSortBySubmit(event, target) {
    event.preventDefault();

    const url = Url.parse(location.href, true);
    const queryParams = $(target).serialize().split('=');

    url.query[queryParams[0]] = queryParams[1];
    delete url.query['page'];

    this._goToUrl(Url.format({ pathname: url.pathname, query: url.query }));
  }

  _onStateChange() {
    $(document.body).addClass('scroll-locked');
    $(this.options.blocker).addClass('visible');

    api.getPage(History.getState().url, this.requestOptions, (err, content) => {
      $(document.body).removeClass('scroll-locked');
      $(this.options.blocker).removeClass('visible');

      if (err) {
        throw new Error(err);
      }

      this._refreshView(content);
    });
  }

  _refreshView(content) {
    if (content) {

      if (this.$gridLayout === "masonry-grid") {
        this.layoutSetup.destroyMasonry();
      }

      $(this.containerSelectors.productListing)
        .html('')
        .append(content.productListing);
      $(this.containerSelectors.sideBar).html(content.sideBar);

      if (this.$gridLayout === "masonry-grid") {
        this.layoutSetup.init();
      } else {
        const $select = $('[data-sort-by] select');
        new SelectWrapper($select);
      }
    }
  }

  _goToUrl(url) {
    // TODO: Wait for a fix from BC re: malformed pagination links
    History.pushState({}, document.title, url);
  }

}
