export default class FilmModel {
  #films;
  #comments;

  constructor (films, comments) {
    this.#films = films;
    this.#comments = comments;
  }

  get films() {
    return this.#films;
  }

  get comments() {
    return this.#comments;
  }
}
