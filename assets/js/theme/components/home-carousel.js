import _ from 'lodash';
import Flickity from 'flickity';
import isElementInViewport from '../utils/inViewPort';

export default class HomeCarousel {
  constructor(options, context) {
    this.context = context;
    this.el = options.carousel;
    this.$el = $(this.el);
    this.carouselItem = options.cellSelector;
    this.hasNavigation = $(this.carouselItem).length > 1;
    this.autoPlay = (this.context.carouselDelay !== 0 ? this.context.carouselDelay : false);

    //eslint-disable-next-line no-undef
    this.flickity = new Flickity(this.el, {
      arrowShape: ' ',
      cellSelector: this.carouselItem,
      contain: true,
      imagesLoaded: false,
      prevNextButtons: this.hasNavigation,
      autoPlay: this.autoPlay,
      pageDots: this.hasNavigation,
      freeScroll: false,
      wrapAround: true,
      draggable: true,
      selectedAttraction: 0.015,
      initialIndex: this.$el.data('carousel-position'),
    });

    this._bindEvents();
  }

  _bindEvents() {
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
  }

  _pauseSlider() {
    if(this.flickity.player.isPlaying){
      this.flickity.deactivatePlayer();
    }
  }

  _playSlider() {
    if(!this.flickity.player.isPlaying){
      this.flickity.activatePlayer();
    }
  }
}
