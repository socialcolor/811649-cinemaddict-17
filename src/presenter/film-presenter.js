import {render, remove, replace} from '../framework/render';
import FilmItemView from '../view/film-item-view';
import FilmDetailsView from '../view/film-details-view';
import {setScrollPosition, getScrollPosition} from '../utils/film';

export default class FilmPresenter {
  #comments = null;
  #container = null;
  #changeData = null;
  #closePopup = null;

  #film = null;
  #filmView = null;
  #filmDetailsView = null;

  constructor (comments, container, controlsChange, closePopup) {
    this.#comments = [...comments];
    this.#container = container;
    this.#changeData = controlsChange;
    this.#closePopup = closePopup;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmView = this.#filmView;

    this.#filmView = new FilmItemView(film);

    this.#filmView.setFilmLinkHandler(this.#openPopup);
    this.#filmView.setWatchlistHandler(this.#onWatchListClick);
    this.#filmView.setWatchedHandler(this.#onWatchedClick);
    this.#filmView.setFavoriteHandler(this.#onFavoriteClick);
    if(prevFilmView === null) {
      render(this.#filmView, this.#container);
    } else {
      replace(this.#filmView, prevFilmView);
    }

    if(this.#filmDetailsView) {
      this.#renderDetails();
    }
  };

  destroy = () => {
    remove(this.#filmView);
  };

  #renderDetails = () => {
    const prevFilmDetailsView = this.#filmDetailsView;
    this.#filmDetailsView = new FilmDetailsView(this.#film, this.#comments);
    this.#filmDetailsView.setCloseButtonHandler(this.#onCloseClick);
    this.#filmDetailsView.setWatchlistHandler(this.#onWatchListClick);
    this.#filmDetailsView.setWatchedHandler(this.#onWatchedClick);
    this.#filmDetailsView.setFavoriteHandler(this.#onFavoriteClick);

    if(prevFilmDetailsView === null) {
      render(this.#filmDetailsView, document.body);
    } else {
      replace(this.#filmDetailsView, prevFilmDetailsView);
    }
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

  closePopup = function closePopup () {
    if(this.#filmDetailsView) {
      document.body.classList.remove('hide-overflow');
      this.#filmDetailsView.element.querySelector('.film-details__close-btn').removeEventListener('click', this.#onCloseClick);
      remove(this.#filmDetailsView);
      document.removeEventListener('keydown', this.#onEscKeyDown);
      this.#filmDetailsView = null;
    }
  };

  #openPopup = () => {
    this.#closePopup();
    this.#renderDetails();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #onWatchListClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, watchlist: !userDetails.watchlist}};
    const scrollPosition = this.#filmDetailsView ? getScrollPosition(this.#filmDetailsView.element) : null;
    this.#changeData(change);
    if(scrollPosition) {
      setScrollPosition(this.#filmDetailsView.element, scrollPosition);
    }
  };

  #onWatchedClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, alreadyWatched: !userDetails.alreadyWatched}};
    const scrollPosition = this.#filmDetailsView ? getScrollPosition(this.#filmDetailsView.element) : null;
    this.#changeData(change);
    if(scrollPosition) {
      setScrollPosition(this.#filmDetailsView.element, scrollPosition);
    }
  };

  #onFavoriteClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, favorite: !userDetails.favorite}};
    const scrollPosition = this.#filmDetailsView ? getScrollPosition(this.#filmDetailsView.element) : null;
    this.#changeData(change);
    if(scrollPosition) {
      setScrollPosition(this.#filmDetailsView.element, scrollPosition);
    }
  };

}
