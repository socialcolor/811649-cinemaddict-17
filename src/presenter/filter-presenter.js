import {render, remove, replace, RenderPosition} from '../framework/render';
import FilmFilterView from '../view/film-filter-view';
import {filter} from '../utils/filter';
import {FiltersType, UpdateType} from '../const';

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
        type: FiltersType.ALL,
        name: 'All',
        count: filter[FiltersType.ALL](films).length,
      },
      {
        type: FiltersType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FiltersType.WATCHLIST](films).length,
      },
      {
        type: FiltersType.HISTORY,
        name: 'Already Watched',
        count: filter[FiltersType.HISTORY](films).length,
      },
      {
        type: FiltersType.FAVORITES,
        name: 'Favorites',
        count: filter[FiltersType.FAVORITES](films).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterView = this.#filterView;

    this.#filterView = new FilmFilterView(filters, this.#filterModel.filter);
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
