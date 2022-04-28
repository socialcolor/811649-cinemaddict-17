import {createElement} from '../render';

const createFilmListTitleTemplate = () => '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>';

export default class FilmListTitleView {
  getTemplate() {
    return createFilmListTitleTemplate();
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
