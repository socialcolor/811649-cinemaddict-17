import {generateFilm, generateComment} from '../mock/film';

export default class filmModel {
  films = Array.from({length: 10}, generateFilm);
  comments = Array.from({length: 100}, generateComment);
  //Я могу здсь сгнерировать комменты, по аналогии с фильмами, но как сделать связь их с фильмом?
  //Длинну комментов я могу выбрать рандомную,

  //Здесь я присваиваю Id каждому фильму, т.к. именно здесь количество фильмов генерируется
  getFilms = () => {
    console.log(this.comments)
    this.films.forEach((film, index) => {
      film.id = index;
    });
    return this.films;
  };
}
