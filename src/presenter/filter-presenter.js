import {render, remove, replace} from '../framework/render';
import FilterView from '../view/film-filter-view';

export default class FilterPresenter {
  #container = null;
  filterChanged = null;

  #filters = null;
  #activeFilter = null;

  #filterView = null;

  constructor (container, filterChanged) {
    this.#container = container;
    this.filterChanged = filterChanged;
  }

  init = (filters, activeFilter) => {
    this.#filters = filters;
    this.#activeFilter = activeFilter;

    const prevFilterView = this.#filterView;

    this.#filterView = new FilterView(this.#filters.watchlist, this.#filters.alreadyWatched, this.#filters.favorite, this.#activeFilter);

    if(prevFilterView === null) {
      render(this.#filterView, this.#container);
    } else {
      replace(this.#filterView, prevFilterView);
    }
    this.#filterView.setAllFilterHandler(this.#onFilterClick);
  };

  #onFilterClick = (filter) => {
    this.filterChanged(filter);
  };

  destroy = () => {
    remove(this.#filterView);
  };
}
