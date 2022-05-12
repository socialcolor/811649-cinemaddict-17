import AbstractView from '../framework/view/abstract-view';

const createFilmListEmptyTemplate = (title) => `<h2 class="films-list__title">${title}</h2>`;

export default class FilmListEmptyView extends AbstractView {
  #title = null;

  constructor (title) {
    super();
    this.#title = title;
  }

  get template() {
    return createFilmListEmptyTemplate(this.#title);
  }
}
