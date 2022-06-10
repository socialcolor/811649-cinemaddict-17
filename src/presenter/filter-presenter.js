import {render, remove, replace, RenderPosition} from '../framework/render';
import FilterView from '../view/film-filter-view';
import {filter} from '../utils/filter';
import {FILTERS_TYPE, UpdateType} from '../const';

export default class FilterPresenter {
  #container = null;
  #filmsModel = null;
  #filterModel = null;
  filterChanged = null;

  #filterView = null;

  constructor (container, filmModelm, filterModel) {
    this.#container = container;
    this.#filmsModel = filmModelm;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FILTERS_TYPE.ALL,
        name: 'All',
        count: filter[FILTERS_TYPE.ALL](films).length,
      },
      {
        type: FILTERS_TYPE.WATCHLIST,
        name: 'Watchlist',
        count: filter[FILTERS_TYPE.WATCHLIST](films).length,
      },
      {
        type: FILTERS_TYPE.HISTORY,
        name: 'Already Watched',
        count: filter[FILTERS_TYPE.HISTORY](films).length,
      },
      {
        type: FILTERS_TYPE.FAVORITES,
        name: 'Favorites',
        count: filter[FILTERS_TYPE.FAVORITES](films).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterView = this.#filterView;

    this.#filterView = new FilterView(filters, this.#filterModel.filter);
    this.#filterView.setAllFilterHandler(this.#onFilterClick);

    if(prevFilterView === null) {
      render(this.#filterView, this.#container, RenderPosition.BEFOREBEGIN);
      return;
    }

    replace(this.#filterView, prevFilterView);
    remove(prevFilterView);
  };

  #onModelEvent = () => {
    this.init();
  };

  #onFilterClick = (filterType) => {
    if(this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
