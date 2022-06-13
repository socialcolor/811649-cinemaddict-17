import Observable from '../framework/observable.js';
import {FILTERS_TYPE} from '../const.js';

export default class FilterModel extends Observable {
  #filter = FILTERS_TYPE.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  };
}
