import AbstractView from '../framework/view/abstract-view';

const createFilmListTitleTemplate = (title) => `<h2 class="films-list__title visually-hidden">${title} movies. Upcoming</h2>`;

export default class FilmListTitleView extends AbstractView {
  #title = null;

  constructor(title) {
    super();
    this.#title = title;
  }

  get template() {
    return createFilmListTitleTemplate(this.#title);
  }
}
