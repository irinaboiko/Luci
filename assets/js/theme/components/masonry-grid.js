import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

export default class MasonryGrid {
  constructor(options = {}) {

    this.masonryOptions = $.extend({
      masonrySelector: '.grid-masonry',
      gutter: '.layout-grid-gutter',
      horizontalOrder: true,
      columnWidth: '.layout-grid-sizer',
      itemSelector: '.layout-grid-item',
      percentPosition: true,
      originLeft: true,
    }, options);

    this.$masonry = $(this.masonryOptions.masonrySelector);
  }

  init(){
    if (this.$masonry.length) {
      // Use .makeJQueryPlugin to make .imagesLoaded() jQuery plugin.
      imagesLoaded.makeJQueryPlugin($);

      this.$masonry.imagesLoaded(() => {
        this._startMasonry();
      });
    }
  }

  _startMasonry() {
    if (this.$masonry) {
      this.masonry = new Masonry(this.masonryOptions.masonrySelector, this.masonryOptions);
      this.masonry.layout();

      this._bindEvents();
    }
  }

  _bindEvents() {
    this.$masonry.on('update-layout', () => {
      this.masonry.layout();
    });
  }

  destroyMasonry() {
    this.masonry.destroy();
  }

}
