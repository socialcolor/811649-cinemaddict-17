import AbstractView from '../framework/view/abstract-view';
import {SORT_TYPE} from '../const';

const createFilmsSortTemplate = (sort) => {
  const sortDefault = sort === SORT_TYPE.DEFAULT ? 'sort__button--active' : '';
  const sortDate = sort === SORT_TYPE.DATE ? 'sort__button--active' : '';
  const sortRating = sort === SORT_TYPE.RATING ? 'sort__button--active' : '';

  return `<ul class="sort">
    <li><a href="#" class="sort__button ${sortDefault}" data-sort="${SORT_TYPE.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${sortDate}" data-sort="${SORT_TYPE.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${sortRating}" data-sort="${SORT_TYPE.RATING}">Sort by rating</a></li>
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

  #onSortClick = (evt) => {
    if(evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.onSortClick(evt.target.dataset.sort);
  }

  setSortClickHandler(callback) {
    this._callback.onSortClick = callback;
    this.element.addEventListener('click', this.#onSortClick);
  }
}
