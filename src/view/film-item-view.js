import {createElement} from '../render';

const createFilmItemTemplate = (film) => {
  const {filmInfo} = film;
  const watchlist = filmInfo.userDetails.watchlist === true ? 'film-card__controls-item--active' : '';
  const alreadyWatched = filmInfo.userDetails.alreadyWatched === true ? 'film-card__controls-item--active' : '';
  const favorite = filmInfo.userDetails.favorite === true ? 'film-card__controls-item--active' : '';
  const description = filmInfo.description.length <= 140 ? filmInfo.description.replace(/ $/, '') : `${filmInfo.description.substring(0, 139)  }...`;

  return `<article class="film-card">
     <a class="film-card__link">
       <h3 class="film-card__title">${filmInfo.title}</h3>
       <p class="film-card__rating">${filmInfo.rate}</p>
       <p class="film-card__info">
         <span class="film-card__year">${filmInfo.release.date}</span>
         <span class="film-card__duration">${filmInfo.runtime}</span>
         <span class="film-card__genre">${filmInfo.genre}</span>
       </p>
       <img src="./images/posters/${filmInfo.poster}" alt="" class="film-card__poster">
       <p class="film-card__description">${description}</p>
       <span class="film-card__comments">${filmInfo.comments} comments</span>
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
