import PageManager from '../PageManager';
import MasonryGrid from './components/masonry-grid';

export default class Blog extends PageManager {
  constructor () {
    super();
  }

  loaded (next) {

    const layout = new MasonryGrid();
    layout.init();

    next();
  }
}

