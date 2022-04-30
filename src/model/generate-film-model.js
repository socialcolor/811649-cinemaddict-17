import {generateFilm, generateComment} from '../mock/film';
import { FILM_LENGTH } from '../const';

export default class filmModel {
  films = Array.from({length: FILM_LENGTH}, generateFilm);
  comments = Array.from({length: 100}, generateComment);
  //Я могу здсь сгнерировать комменты, по аналогии с фильмами, но как сделать связь их с фильмом?
  //Длинну комментов я могу выбрать рандомную,

  //Здесь я присваиваю Id каждому фильму, т.к. именно здесь количество фильмов генерируется
  getFilms = () => {
    this.films.forEach((film, index) => {
      film.id = index + 1;
    });
    return this.films;
  };

  // getComments = () => {
  // return  this.comments
  // };
}
