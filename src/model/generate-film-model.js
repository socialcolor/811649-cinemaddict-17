import {generateFilm} from '../mock/film';

export default class filmModel {
  films = Array.from({length: 10}, generateFilm);

  getFilms = () => this.films;
}
