import PageManager from '../PageManager';
import MasonryGrid from './components/masonry-grid';
import HomeCarousel from './components/home-carousel';

export default class Home extends PageManager {
  constructor() {
    super();

    this.layoutSetup = new MasonryGrid();

    /**
     * @type {{$carouselImages: (jQuery|HTMLElement), $carouselText: (jQuery|HTMLElement)}}
     */
    this.carouselOptions = {
      carousel: '.carousel-wrapper',
      cellSelector: '.carousel-item',
    };

  }

  loaded(next) {
    this.layoutSetup.init();

    if ($(this.carouselOptions.carousel).length) {
      this.carousel = new HomeCarousel(this.carouselOptions, this.context);
    }

    next();
  }
}
