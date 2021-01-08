import PageManager from '../PageManager';
import fitVideos from './utils/fitVideos';

export default class Page extends PageManager {
  constructor() {
    super();
  }

  loaded(next) {
    fitVideos('.page-content-text');

    next();
  }

}

