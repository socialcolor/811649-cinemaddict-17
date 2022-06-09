import Observable from '../framework/observable.js';
import {generateFilms, generateComments} from '../mock/film';

export default class FilmModel extends Observable {
  #films = generateFilms();
  #comments = generateComments();

  get films() {
    return this.#films;
  }

  get comments() {
    return this.#comments;
  }
}
