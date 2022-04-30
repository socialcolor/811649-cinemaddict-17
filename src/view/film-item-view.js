import {createElement} from '../render';

const createFilmItemTemplate = (film) => {
  const watchlist = film.filmInfo.userDetails.watchlist === true ? 'film-card__controls-item--active' : '';
  const alreadyWatched = film.filmInfo.userDetails.alreadyWatched === true ? 'film-card__controls-item--active' : '';
  const favorite = film.filmInfo.userDetails.favorite === true ? 'film-card__controls-item--active' : '';

  return `<article class="film-card">
     <a class="film-card__link">
       <h3 class="film-card__title">${film.filmInfo.title}</h3>
       <p class="film-card__rating">${film.filmInfo.rate}</p>
       <p class="film-card__info">
         <span class="film-card__year">${film.filmInfo.release.date}</span>
         <span class="film-card__duration">${film.filmInfo.runtime}</span>
         <span class="film-card__genre">${film.filmInfo.genre}</span>
       </p>
       <img src="./images/posters/${film.filmInfo.poster}" alt="" class="film-card__poster">
       <p class="film-card__description">${film.filmInfo.description}</p>
       <span class="film-card__comments">5 comments</span>
     </a>
     <div class="film-card__controls">
       <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlist}" type="button">Add to watchlist</button>
       <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatched}" type="button">Mark as watched</button>
       <button class="film-card__controls-item film-card__controls-item--favorite ${favorite}" type="button">Mark as favorite</button>
     </div>
  </article>`;
};

export default class FilmItemView {
  constructor (film) {
    this.film = film;
  }

  getTemplate() {
    return createFilmItemTemplate(this.film);
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
