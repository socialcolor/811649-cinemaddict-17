import {render, remove, replace} from '../framework/render';
import FilmDetailsView from '../view/film-details-view';
import {UserAction, UpdateType} from '../const.js';

export default class FilmDetailsPresenter {
  #film = null;
  #comments = null;
  #changeData = null;
  #isOpened = false;

  #filmDetailsView = null;

  constructor (controlsChange) {
    this.#changeData = controlsChange;
  }

  init = (film, comments) => {
    this.#film = film;
    this.#comments = comments;
    this.#renderDetails();
  };

  get isOpened () {
    return this.#isOpened;
  }

  getScrollPosition = () => this.#filmDetailsView.element.scrollTop;

  setScrollPosition = (scrollPosition) => (this.#filmDetailsView.element.scrollTop = scrollPosition);

  closePopup = () => {
    if(this.#filmDetailsView) {
      document.body.classList.remove('hide-overflow');
      this.#filmDetailsView.element.querySelector('.film-details__close-btn').removeEventListener('click', this.#onCloseClick);
      remove(this.#filmDetailsView);
      document.removeEventListener('keydown', this.#onEscKeyDown);
      this.#filmDetailsView = null;
    }
    this.#isOpened = false;
  };

  #renderDetails = () => {
    const prevFilmDetailsView = this.#filmDetailsView;
    this.#filmDetailsView = new FilmDetailsView(this.#film, this.#comments);

    if(prevFilmDetailsView === null) {
      render(this.#filmDetailsView, document.body);
    } else {
      replace(this.#filmDetailsView, prevFilmDetailsView);
    }

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#filmDetailsView.setCloseButtonHandler(this.#onCloseClick);
    this.#filmDetailsView.setDeleteCommentHandler(this.#onDeletClick);
    this.#filmDetailsView.setWatchlistHandler(this.#onWatchListClick);
    this.#filmDetailsView.setWatchedHandler(this.#onWatchedClick);
    this.#filmDetailsView.setFavoriteHandler(this.#onFavoriteClick);
    this.#isOpened = true;
  };

  #onCloseClick = () => {
    this.closePopup();
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.closePopup();
    }
  };

  #onDeletClick = (id) => {
    const film = {...this.#film, comments: [...this.#film.comments]};
    const index = this.#film.comments.findIndex((commentIndex) => Number(commentIndex) === Number(id));
    film.comments.splice(index, 1);
    this.#changeData(UserAction.DELETE_COMMENT, UpdateType.MINOR, film);
  };

  #onWatchListClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, watchlist: !userDetails.watchlist}};
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, change);
  };

  #onWatchedClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, alreadyWatched: !userDetails.alreadyWatched}};
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, change);
  };

  #onFavoriteClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, favorite: !userDetails.favorite}};
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, change);
  };
}
