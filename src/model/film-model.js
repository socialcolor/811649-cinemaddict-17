export default class FilmModel {
  constructor (films, comments) {
    this.films = films;
    this.comments = comments;
  }

  getFilms = () => this.films;
  getComments = () => this.comments;
}
