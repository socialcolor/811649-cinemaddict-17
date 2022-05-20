import AbstractView from '../framework/view/abstract-view';
import {formatDate, formatTime} from '../utils';

const createFilmItemTemplate = (film) => {
  const {filmInfo, comments} = film;
  const watchlist = filmInfo.userDetails.watchlist ? 'film-card__controls-item--active' : '';
  const alreadyWatched = filmInfo.userDetails.alreadyWatched ? 'film-card__controls-item--active' : '';
  const favorite = filmInfo.userDetails.favorite ? 'film-card__controls-item--active' : '';
  const description = filmInfo.description.length > 140 ? `${filmInfo.description.substring(0, 139)  }...` : filmInfo.description;

  return `<article class="film-card">
     <a class="film-card__link">
       <h3 class="film-card__title">${filmInfo.title}</h3>
       <p class="film-card__rating">${filmInfo.rate}</p>
       <p class="film-card__info">
         <span class="film-card__year">${formatDate(filmInfo.release.date, 1, 1100, 'YYYY')}</span>
         <span class="film-card__duration">${formatTime(filmInfo.runtime)}</span>
         <span class="film-card__genre">${filmInfo.genre}</span>
       </p>
       <img src="./images/posters/${filmInfo.poster}" alt="" class="film-card__poster">
       <p class="film-card__description">${description}</p>
       <span class="film-card__comments">${comments.length} comments</span>
     </a>
     <div class="film-card__controls">
       <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlist}" data-name="watchlist" type="button">Add to watchlist</button>
       <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatched}" data-name="alreadyWatched" type="button">Mark as watched</button>
       <button class="film-card__controls-item film-card__controls-item--favorite ${favorite}" data-name="favorite" type="button">Mark as favorite</button>
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

  setFilmLinkHandler(callback) {
    this._callback.onFilmLinkClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#onFilmLinkClick);
  }

  setFilmButtonClick(callback) {
    this._callback.onFilmButtonClick = callback;
    this.element.querySelector('.film-card__controls').addEventListener('click', this.#onFilmButtonClick);
  }

  #onFilmLinkClick = (evt) => {
    evt.preventDefault();
    this._callback.onFilmLinkClick();
  };

  #onFilmButtonClick = (evt) => {
    if(evt.target.tagName.toLowerCase() === 'button') {
      evt.preventDefault();
      evt.target.classList.toggle('film-card__controls-item--active');
      this._callback.onFilmButtonClick(evt.target.dataset.name);
    }
  };

  changheStateFilm = (name) => {
    if(name === 'watchlist') {
      this.element.querySelector('.film-card__controls-item--add-to-watchlist').classList.toggle('film-card__controls-item--active');
    } else if(name === 'alreadyWatched') {
      this.element.querySelector('.film-card__controls-item--mark-as-watched').classList.toggle('film-card__controls-item--active');
    } else if(name === 'favorite') {
      this.element.querySelector('.film-card__controls-item--favorite').classList.toggle('film-card__controls-item--active');
    }
  };

}
