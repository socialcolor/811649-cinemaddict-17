import Observable from '../framework/observable.js';
import {FiltersType} from '../const.js';

export default class FilterModel extends Observable {
  #filter = FiltersType.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  };
}
