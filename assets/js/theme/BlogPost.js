import PageManager from '../PageManager';
import SharingButtons from './components/sharing-buttons';
import fitVideos from './utils/fitVideos';

export default class BlogPost extends PageManager {
  constructor() {
    super();

  }

  loaded(next) {
    new SharingButtons('[data-share-button]', this.context);
    fitVideos('.blog-post-text');

    next();
  }
}
