import AbstractView from '../framework/view/abstract-view';
import {FILTERS_TYPE} from '../const';

const createFilterTemplate = (watchlist, history, favorite, activeFilter) => {
  const watchlistCount = watchlist.length;
  const historyCount = history.length;
  const favoriteCount = favorite.length;

  const activeAll = activeFilter === FILTERS_TYPE.ALL ? 'main-navigation__item--active' : '';
  const activeWatchlist = activeFilter === FILTERS_TYPE.WATCHLIST ? 'main-navigation__item--active' : '';
  const activeHistory = activeFilter === FILTERS_TYPE.HISTORY ? 'main-navigation__item--active' : '';
  const activeFavorites = activeFilter === FILTERS_TYPE.FAVORITES ? 'main-navigation__item--active' : '';

  return `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item ${activeAll}" data-filter="${FILTERS_TYPE.ALL}">All movies</a>
      <a href="#watchlist" class="main-navigation__item ${activeWatchlist}" data-filter="${FILTERS_TYPE.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
      <a href="#history" class="main-navigation__item ${activeHistory}" data-filter="${FILTERS_TYPE.HISTORY}">History <span class="main-navigation__item-count">${historyCount}</span></a>
      <a href="#favorites" class="main-navigation__item ${activeFavorites}" data-filter="${FILTERS_TYPE.FAVORITES}">Favorites <span class="main-navigation__item-count">${favoriteCount}</span></a>
  </nav>`;
};

export default class FilterView extends AbstractView {
  #watchlist = null;
  #history = null;
  #favorite = null;
  #activeFilter = null;

  constructor (watchlist, history, favorite, activeFilter) {
    super();
    this.#history = history;
    this.#watchlist = watchlist;
    this.#favorite = favorite;
    this.#activeFilter = activeFilter;
  }

  get template() {
    return createFilterTemplate(this.#watchlist, this.#history, this.#favorite, this.#activeFilter);
  }

  #onFilterClick = (evt) => {
    if(evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.onFilterClick(evt.target.dataset.filter);
  };

  setAllFilterHandler = (callback) => {
    this._callback.onFilterClick = callback;
    this.element.addEventListener('click', this.#onFilterClick);
  };
}
