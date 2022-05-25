import {render, remove, replace} from '../framework/render';
import FilterView from '../view/film-filter-view';
import {FILTERS_TYPE} from '../const';

export default class FilterPresenter {
  #container = null;
  filterChanged = null;

  #activeFilter = null;

  #filterView = null;

  constructor (container, filterChanged) {
    this.#container = container;
    this.filterChanged = filterChanged;
  }

  init = (films, activeFilter = FILTERS_TYPE.ALL) => {
    const watchlist = films.filter((film) => film.userDetails.watchlist);
    const history = films.filter((film) => film.userDetails.alreadyWatched);
    const favorites = films.filter((film) => film.userDetails.favorite);
    this.#activeFilter = activeFilter;

    const prevFilterView = this.#filterView;

    this.#filterView = new FilterView(watchlist, history, favorites, this.#activeFilter);

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
