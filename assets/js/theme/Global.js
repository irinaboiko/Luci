import PageManager from '../PageManager';
import ThemeInit from './global/theme-init';
import FormValidator from './utils/FormValidator';
import scrollTarget from './utils/scrollTarget';
import CurrencySelector from './global/currency-selector';
import ProductCompare from './global/product-compare';
import QuickShopManager from './components/quick-shop-manager';
import RemoteProductAdd from './components/remoteProductAdd';
import Navigation from './components/navigation';
import SearchModal from './components/search-modal';
import QuickCart from './components/quick-cart';
import SelectWrapper from './global/select-wrapper';
import './core/selectOption';

export default class Global extends PageManager {
  constructor() {
    super();

    new CurrencySelector($('select.quick-cart-currency-selector'));

    const $select = $('select');
    if ($select.length) {
      $select.each((i) => {
        new SelectWrapper($select.eq(i));
      });
    }

    this._bindEvents();
  }

  _bindEvents(){
    $('[data-scroll-to]').on('click', (event) => {
      event.preventDefault();
      const target = $(event.target).closest('[data-scroll-to]').data('scroll-to');
      scrollTarget(target);
    });
  }
  /**
   * You can wrap the execution in this method with an asynchronous function map using the async library
   * if your global modules need async callback handling.
   * @param next
   */
  loaded(next) {
    // global form validation
    this.validator = new FormValidator(this.context);
    this.validator.initGlobal();

    const $otherForms = $('[data-validates]');
    if ($otherForms.length) {
      $otherForms.each((i) => {
        //Initialises non standard forms
        this.validator.initSingle($otherForms.eq(i));
      });
    }

    //HTML helper classes
    new ThemeInit();

    new Navigation(this.context);
    new RemoteProductAdd(this.context);
    new SearchModal();
    new QuickCart();

    // form validation
    this.validator;

    if ($('.quick-shop-trigger').length) {
      new QuickShopManager(this.context);
    }

    if ($('.product-item-compare').length > 1) {
      new ProductCompare(this.context);
    }

    next();
  }
}
