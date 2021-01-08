import _ from 'lodash';
import imagesLoaded from 'imagesloaded';
import Flickity from 'flickity';
import isElementInViewport from '../utils/inViewPort';
import Zoom from 'bc-zoom';

export default class ProductSlideshow {
  constructor(el, context) {
    this.el = el;
    this.$el = $(this.el);
    this.context = context;
    this.$container = this.$el.parents('[data-slideshow-container]');
    this.startingPostition = parseInt(this.$el.data('start-position'), 10);
    this.slideshowImage = '.single-product-slideshow-image';
    this.$slideshowImage = this.$el.find(this.slideshowImage);
    this.thumbnailSingle = '.single-product-thumbnail';
    this.$thumbnailContainer = this.$container.find('.single-product-thumbnails');
    this.setupSlides = new $.Deferred();
    this.imageLightbox = new Zoom('[data-product-image]', this.context);

    this._bindEvents();
    this._setupSlides();

    this.setupSlides.done(() => {
      this._bindEvents();
    });
  }

  _bindEvents() {
    $(this.thumbnailSingle).on('click', (event) => {
      event.preventDefault();
      this._switchProductImage(event);
    });

    $(this.slideshowImage).on('click', (event) => {
      event.preventDefault();
      this._switchProductImage(event);
    });

    $(window).on('blur', () => {
      this._pauseSlider();
    });

    $(window).on('focus', () => {
      this._playSlider();
    });

    $(window).on('scroll', _.debounce(() => {
      if (isElementInViewport(this.$el[0])) {
        this._playSlider();
      } else {
        this._pauseSlider();
      }
    }, 200));

    $(document.body).on('click', '[data-product-image]', (event) => {
      event.preventDefault();
      this.imageLightbox.show($(event.currentTarget).data('slide-position'));
    });
  }

  _setupSlides() {
    // Use .makeJQueryPlugin to make .imagesLoaded() jQuery plugin.
    imagesLoaded.makeJQueryPlugin($);

    this.$el.imagesLoaded(() => {
      let slideshowWidth = 0;

      for (let i = 0; i < this.$slideshowImage.length; i++) {
        const $image = this.$slideshowImage.eq(i);
        slideshowWidth = slideshowWidth + $image.width();
      }

      const flickityOptions = {
        adaptiveHeight: true,
        cellSelector: this.slideshowImage,
        contain: true,
        draggable: false,
        freeScroll: false,
        imagesLoaded: true,
        initialIndex: this.startingPostition,
        pageDots: false,
        prevNextButtons: false,
        resize: true,
        wrapAround: false,
      };

      this.flickity = new Flickity(this.el, flickityOptions);

      this.setupSlides.resolve();
    });
  }

  _switchProductImage(event) {
    const $target = $(event.target).parent();
    let $thumbnail;
    let index;

    if ($target.hasClass(this.slideshowImage)) {
      index = $target.data('slide-position');
      $thumbnail = this.$container.find(`${this.thumbnailSingle}[data-slide-position=${index}]`);
    } else {
      $thumbnail = $target;
      index = $target.data('slide-position');
    }

    this.$thumbnailContainer.find('.active').removeClass('active');

    $thumbnail.addClass('active');

    this.flickity.select(index);
  }

  _pauseSlider() {
    this.flickity.deactivatePlayer();
  }

  _playSlider() {
    this.flickity.activatePlayer();
  }
}
