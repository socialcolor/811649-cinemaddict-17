import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class FilmModel extends Observable {
  #filmsApiServices = null;
  #films = [];

  constructor(filmsApiServices) {
    super();
    this.#filmsApiServices = filmsApiServices;
  }

  get films() {
    return this.#films;
  }

  getСomments = (id) => this.#filmsApiServices.getComments(id);

  init = async () => {
    try {
      const films = await this.#filmsApiServices.films;
      this.#films = films.map(this.#adaptToClient);
    } catch {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
  };

  updateFilm = async (updateType, update) => {
    try {
      const response = await this.#filmsApiServices.updateFilm(update);
      const updateFilm = this.#adaptToClient(response);

      this.addFilms(updateFilm);

      this._notify(updateType, updateFilm);
    } catch(err) {
      throw new Error(`Can't update film. Error >>> ${err}`);
    }
  };

  addFilms = (update) => {
    const index =  this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];
  };

  addComment = async (updateType, update) => {
    try {
      const response = await this.#filmsApiServices.addComment(update.id, update.localComment);

      const film = this.#adaptToClient(response.movie);

      this.addFilms(film);

      this._notify(updateType, film);
    } catch(err) {
      throw new Error(`Cant't add comment. Error >>> ${err}`);
    }
  };

  deleteComment = async (updateType, update) => {
    const filmId = Number(update.id);
    const index =  this.#films.findIndex((film) => Number(film.id) === filmId);

    try {
      await this.#filmsApiServices.deleteComment(update.commentId);
      this.#films[index].comments = this.#films[index].comments.filter((comment) => Number(comment) !== Number(update.commentId));
      this._notify(updateType, this.#films[index]);
    } catch(err) {
      throw new Error(`Cant't delete comment. Error >>> ${err}`);
    }
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      filmInfo: {...film.film_info,
        alternativeTitle: film.film_info.alternative_title,
        ageRating: film.film_info.age_rating,
        rate: film.film_info.total_rating,
        release: {...film.film_info.release,
          releaseCountry: film.film_info.release.release_country
        },
      },
      userDetails: {...film.user_details,
        alreadyWatched: film.user_details.already_watched,
        watchingDate: film.user_details.watching_date,
      }
    };

    delete adaptedFilm.film_info;
    delete adaptedFilm.filmInfo.alternative_title;
    delete adaptedFilm.filmInfo.age_rating;
    delete adaptedFilm.filmInfo.total_rating;
    delete adaptedFilm.filmInfo.release.release_country;
    delete adaptedFilm.user_details;
    delete adaptedFilm.userDetails.already_watched;
    delete adaptedFilm.userDetails.watching_date;

    return adaptedFilm;
  };
}
