import {createElement} from '../render';

const createFilmListTemplate = () => (
  `<section class="films-list">
    <div class="films-list__container"></div>
  </section>`
);

export default class FilmListView {
  getTemplate() {
    return createFilmListTemplate();
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
