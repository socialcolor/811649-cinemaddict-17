import {render, remove} from '../framework/render';
import FilmItemView from '../view/film-item-view';
import FilmDetailsView from '../view/film-details-view';
import FilmDetailsCommentView from '../view/film-details-comments.view';

export default class FilmPresenter {
  #film = null;
  #container = null;
  #comments = null;
  #filmView = null;
  #filmDetailsView = null;

  constructor (film, comments, container) {
    this.#film = film;
    this.#comments = [...comments];
    this.#container = container;
    this.init();
  }

  init = () => {
    this.#filmView = new FilmItemView(this.#film);
    this.#filmDetailsView = new FilmDetailsView(this.#film);
    this.#rednerFilm();
  };

  #onDetailsButtonClick = (name) => {
    if (this.#film.filmInfo.userDetails[name]) {
      this.#film.filmInfo.userDetails[name] = false;
    } else {
      this.#film.filmInfo.userDetails[name] = true;
    }
    this.#filmView.changheStateFilm(name);
  };

  #renderDetails = () => {
    render(this.#filmDetailsView, document.body);
    this.#filmDetailsView.setDetailsControlsHandler(this.#onDetailsButtonClick);
    const commentsContainer = this.#filmDetailsView.element.querySelector('.film-details__comments-list');

    for(let i = 0; i < this.#film.comments.length; i++) {
      const commentsId = this.#comments[i];
      render(new FilmDetailsCommentView(commentsId), commentsContainer);
    }
  };

  #onCloseClick = () => {
    this.#closePopup();
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #closePopup = function closePopup () {
    document.body.classList.remove('hide-overflow');
    this.#filmDetailsView.element.querySelector('.film-details__close-btn').removeEventListener('click', this.#onCloseClick);
    remove(this.#filmDetailsView);
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #openPopup = () => {
    if(!(document.querySelector('.film-details'))) {
      document.body.classList.add('hide-overflow');
      this.#renderDetails();

      document.addEventListener('keydown', this.#onEscKeyDown);
      this.#filmDetailsView.seCloseButtonHandler(this.#onCloseClick);
    }
  };

  #onFilmButtonClick = (name) => {
    if (this.#film.filmInfo.userDetails[name]) {
      this.#film.filmInfo.userDetails[name] = false;
    } else {
      this.#film.filmInfo.userDetails[name] = true;
    }
    remove(this.#filmDetailsView);
    this.#filmDetailsView = new FilmDetailsView(this.#film);
  };

  #rednerFilm = () => {
    render(this.#filmView, this.#container);
    this.#filmView.setFilmLinkHandler(this.#openPopup);
    this.#filmView.setFilmButtonClick(this.#onFilmButtonClick);
  };
}
