import AbstractView from '../framework/view/abstract-view';
import {FILTERS_TYPE} from '../const';
import {getCountFilmsInFilters} from '../utils/filter';

const createFilterTemplate = (filters, activeFilter) => {
  const activeAll = activeFilter === FILTERS_TYPE.ALL ? 'main-navigation__item--active' : '';
  const activeWatchlist = activeFilter === FILTERS_TYPE.WATCHLIST ? 'main-navigation__item--active' : '';
  const activeHistory = activeFilter === FILTERS_TYPE.HISTORY ? 'main-navigation__item--active' : '';
  const activeFavorites = activeFilter === FILTERS_TYPE.FAVORITES ? 'main-navigation__item--active' : '';
  const watchlistCount = getCountFilmsInFilters(filters)[FILTERS_TYPE.WATCHLIST];
  const historyCount = getCountFilmsInFilters(filters)[FILTERS_TYPE.HISTORY];
  const favoritesCount = getCountFilmsInFilters(filters)[FILTERS_TYPE.FAVORITES];

  return `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item ${activeAll}" data-filter="${FILTERS_TYPE.ALL}">All movies</a>
      <a href="#watchlist" class="main-navigation__item ${activeWatchlist}" data-filter="${FILTERS_TYPE.WATCHLIST}">Watchlist <span class="main-navigation__item-count" data-filter="${FILTERS_TYPE.WATCHLIST}">${watchlistCount}</span></a>
      <a href="#history" class="main-navigation__item ${activeHistory}" data-filter="${FILTERS_TYPE.HISTORY}">History <span class="main-navigation__item-count" data-filter="${FILTERS_TYPE.HISTORY}">${historyCount}</span></a>
      <a href="#favorites" class="main-navigation__item ${activeFavorites}" data-filter="${FILTERS_TYPE.FAVORITES}">Favorites <span class="main-navigation__item-count" data-filter="${FILTERS_TYPE.FAVORITES}">${favoritesCount}</span></a>
  </nav>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #activeFilter = null;

  constructor (filters, activeFilter) {
    super();
    this.#filters = filters;
    this.#activeFilter = activeFilter;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#activeFilter);
  }

  setAllFilterHandler = (callback) => {
    this._callback.onFilterClick = callback;
    this.element.addEventListener('click', this.#onFilterClick);
  };

  #onFilterClick = (evt) => {
    if(evt.target.tagName !== 'SPAN' && evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.onFilterClick(evt.target.dataset.filter);
  };
}
