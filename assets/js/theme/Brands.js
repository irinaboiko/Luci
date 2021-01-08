import PageManager from '../PageManager';
import MasonryGrid from './components/masonry-grid';

export default class Brand extends PageManager {
  constructor () {
    super();

    const layout = new MasonryGrid();
    layout.init();

  }

}
