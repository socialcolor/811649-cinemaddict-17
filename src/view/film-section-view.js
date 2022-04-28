import {createElement} from '../render';

const createFilmSectionTemplate = () => '<section class="films"></section>';

export default class FilmSectionView {
  getTemplate() {
    return createFilmSectionTemplate();
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
