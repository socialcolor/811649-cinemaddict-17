import AbstractView from '../framework/view/abstract-view';
import {formatDate, formatTime} from '../utils';

const createFilmItemTemplate = (film) => {
  const {filmInfo, comments, userDetails} = film;
  const watchlist = userDetails.watchlist ? 'film-card__controls-item--active' : '';
  const alreadyWatched = userDetails.alreadyWatched ? 'film-card__controls-item--active' : '';
  const favorite = userDetails.favorite ? 'film-card__controls-item--active' : '';
  const description = filmInfo.description.length > 140 ? `${filmInfo.description.substring(0, 139)  }...` : filmInfo.description;
  return `<article class="film-card">
     <a class="film-card__link">
       <h3 class="film-card__title">${filmInfo.title}</h3>
       <p class="film-card__rating">${filmInfo.rate}</p>
       <p class="film-card__info">
         <span class="film-card__year">${formatDate(filmInfo.release.date, 'YYYY')}</span>
         <span class="film-card__duration">${formatTime(filmInfo.runtime)}</span>
         <span class="film-card__genre">${filmInfo.genre}</span>
       </p>
       <img src="./images/posters/${filmInfo.poster}" alt="" class="film-card__poster">
       <p class="film-card__description">${description}</p>
       <span class="film-card__comments">${comments.length} comments</span>
     </a>
     <div class="film-card__controls">
       <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlist}" type="button">Add to watchlist</button>
       <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatched}" type="button">Mark as watched</button>
       <button class="film-card__controls-item film-card__controls-item--favorite ${favorite}" type="button">Mark as favorite</button>
     </div>
  </article>`;
};

export default class FilmItemView extends AbstractView {
  #film = null;

  constructor (film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmItemTemplate(this.#film);
  }

  #onFilmLinkClick = (evt) => {
    evt.preventDefault();
    this._callback.onFilmLinkClick();
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.onWatchlistClick();
  };

  #onWatchedClick = (evt) => {
    evt.preventDefault();
    this._callback.onWatchedClick();
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.onFavoriteClick();
  };

  setFilmLinkHandler(callback) {
    this._callback.onFilmLinkClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#onFilmLinkClick);
  }

  setWatchlistHandler(callback) {
    this._callback.onWatchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#onWatchlistClick);
  }

  setWatchedHandler(callback) {
    this._callback.onWatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#onWatchedClick);
  }

  setFavoriteHandler(callback) {
    this._callback.onFavoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#onFavoriteClick);
  }
}
