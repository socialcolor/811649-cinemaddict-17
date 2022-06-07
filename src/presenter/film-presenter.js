import {render, remove, replace} from '../framework/render';
import FilmItemView from '../view/film-item-view';

export default class FilmPresenter {
  #container = null;
  #changeData = null;
  #openPopup = null;

  #film = null;
  #filmView = null;

  constructor (container, controlsChange, openPopup) {
    this.#container = container;
    this.#changeData = controlsChange;
    this.#openPopup = openPopup;
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
    this.#changeData(change);
  };

  #onWatchedClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, alreadyWatched: !userDetails.alreadyWatched}};
    this.#changeData(change);
  };

  #onFavoriteClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, favorite: !userDetails.favorite}};
    this.#changeData(change);
  };
}
