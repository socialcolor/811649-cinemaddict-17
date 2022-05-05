import {createElement} from '../render';

const createFilmListEmptyTemplate = ({title}) => `<h2 class="films-list__title">${title}</h2>`;

export default class FilmListEmptyView {
  constructor (title) {
    this.title = title;
  }

  getTemplate() {
    return createFilmListEmptyTemplate({title: this.title});
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
