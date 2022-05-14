import AbstractView from '../framework/view/abstract-view';

const createFilterTemplate = (watchlist, favorite) => {
  const watchlistLenght = watchlist.length;
  const favoriteLenght = favorite.length;
  return `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistLenght}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">4</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoriteLenght}</span></a>
  </nav>`;
};

export default class FilterView extends AbstractView {
  #watchlist = null;
  #favorite = null;

  constructor (watchlist, favorite) {
    super();
    this.#watchlist = watchlist;
    this.#favorite = favorite;
  }

  get template() {
    return createFilterTemplate(this.#watchlist, this.#favorite);
  }
}
