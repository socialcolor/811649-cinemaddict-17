import AbstractView from '../framework/view/abstract-view';
import {FiltersType} from '../const';
import {getCountFilmsInFilters} from '../utils/filter';

const createFilterTemplate = (filters, activeFilter) => {
  const activeAll = activeFilter === FiltersType.ALL ? 'main-navigation__item--active' : '';
  const activeWatchlist = activeFilter === FiltersType.WATCHLIST ? 'main-navigation__item--active' : '';
  const activeHistory = activeFilter === FiltersType.HISTORY ? 'main-navigation__item--active' : '';
  const activeFavorites = activeFilter === FiltersType.FAVORITES ? 'main-navigation__item--active' : '';
  const watchlistCount = getCountFilmsInFilters(filters)[FiltersType.WATCHLIST];
  const historyCount = getCountFilmsInFilters(filters)[FiltersType.HISTORY];
  const favoritesCount = getCountFilmsInFilters(filters)[FiltersType.FAVORITES];

  return `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item ${activeAll}" data-filter="${FiltersType.ALL}">All movies</a>
      <a href="#watchlist" class="main-navigation__item ${activeWatchlist}" data-filter="${FiltersType.WATCHLIST}">Watchlist <span class="main-navigation__item-count" data-filter="${FiltersType.WATCHLIST}">${watchlistCount}</span></a>
      <a href="#history" class="main-navigation__item ${activeHistory}" data-filter="${FiltersType.HISTORY}">History <span class="main-navigation__item-count" data-filter="${FiltersType.HISTORY}">${historyCount}</span></a>
      <a href="#favorites" class="main-navigation__item ${activeFavorites}" data-filter="${FiltersType.FAVORITES}">Favorites <span class="main-navigation__item-count" data-filter="${FiltersType.FAVORITES}">${favoritesCount}</span></a>
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
