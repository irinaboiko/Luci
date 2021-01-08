import PageManager from '../PageManager';
import SharingButtons from './components/sharing-buttons';
import ProductUtils from './product/product-utils';
import MasonryGrid from './components/masonry-grid';
import ProductSlideshow from './product/product-slideshow';
import ProductReviews from './product/product-reviews';
import fitVideos from './utils/fitVideos';
import baguetteBox from 'baguettebox.js';

export default class Product extends PageManager {
  constructor() {
    super();

    fitVideos('.product-video-container');
    this.layoutSetup = new MasonryGrid();
  }

  loaded(next) {
    if($('[data-product-slideshow]').length){
      new ProductSlideshow('[data-product-slideshow]', this.context);
    }

    // setup masonry layout (for Reviews, and Related products
    this.layoutSetup.init();

    // Setup product utilities (add to cart, etc)
    this.productUtils = new ProductUtils($('.product-container'), this.context, this._bindVariationImgPreview.bind(this));
    this.productUtils.init();

    // Start up review functionality
    new ProductReviews(this.context);

    // Binds the 'Share Button' functionalities
    new SharingButtons('[data-share-button]', this.context);
    next();
  }

  // bind lightbox for dynamically added product variant image
  _bindVariationImgPreview() {
    baguetteBox.run('[data-variation-preview]', {});
  }
}
