import {render, remove, replace} from '../framework/render';
import FilmItemView from '../view/film-item-view';
import {UserAction, UpdateType} from '../const.js';

export default class FilmPresenter {
  #container = null;
  #openPopup = null;
  #onViewAction = null;

  #film = null;
  #filmView = null;

  constructor (container, onViewAction, openPopup) {
    this.#container = container;
    this.#openPopup = openPopup;
    this.#onViewAction = onViewAction;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmView = this.#filmView;

    this.#filmView = new FilmItemView(film);

    this.#filmView.setFilmLinkHandler(this.#onLinkClick);
    this.#filmView.setWatchlistHandler(this.#onWatchListClick);
    this.#filmView.setWatchedHandler(this.#onWatchedClick);
    this.#filmView.setFavoriteHandler(this.#onFavoriteClick);

    if(prevFilmView === null) {
      render(this.#filmView, this.#container);
    } else {
      replace(this.#filmView, prevFilmView);
    }
  };

  destroy = () => {
    remove(this.#filmView);
  };

  #onLinkClick = () => {
    this.#openPopup(this.#film);
  };

  #onWatchListClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, watchlist: !userDetails.watchlist}};
    this.#onViewAction(UserAction.UPDATE_FILM, UpdateType.MINOR, change);
  };

  #onWatchedClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, alreadyWatched: !userDetails.alreadyWatched}};
    this.#onViewAction(UserAction.UPDATE_FILM, UpdateType.PATCH, change);
  };

  #onFavoriteClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, favorite: !userDetails.favorite}};
    this.#onViewAction(UserAction.UPDATE_FILM, UpdateType.PATCH, change);
  };
}
