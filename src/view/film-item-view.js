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
}
