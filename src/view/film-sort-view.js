import AbstractView from '../framework/view/abstract-view';
import {SortType} from '../const';

const createFilmsSortTemplate = (sort) => {
  const sortDefault = sort === SortType.DEFAULT ? 'sort__button--active' : '';
  const sortDate = sort === SortType.DATE ? 'sort__button--active' : '';
  const sortRating = sort === SortType.RATING ? 'sort__button--active' : '';

  return `<ul class="sort">
    <li><a href="#" class="sort__button ${sortDefault}" data-sort="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${sortDate}" data-sort="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${sortRating}" data-sort="${SortType.RATING}">Sort by rating</a></li>
  </ul>`;
};

export default class FilmSortView extends AbstractView {
  #sort = null;

  constructor(sort) {
    super();
    this.#sort = sort;
  }

  get template() {
    return createFilmsSortTemplate(this.#sort);
  }

  setSortClickHandler(callback) {
    this._callback.onSortClick = callback;
    this.element.addEventListener('click', this.#onSortClick);
  }

  #onSortClick = (evt) => {
    if(evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.onSortClick(evt.target.dataset.sort);
  };
}
