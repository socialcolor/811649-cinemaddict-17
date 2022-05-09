import AbstractView from '../framework/view/abstract-view';

const createFilmListTitleTemplate = () => '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>';

export default class FilmListTitleView extends AbstractView {
  get template() {
    return createFilmListTitleTemplate();
  }
}
