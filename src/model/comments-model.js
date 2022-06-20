import Observable from '../framework/observable.js';

export default class CommentModel extends Observable {
  #filmsApiServices = null;
  #comments = [];

  constructor(filmApiServices) {
    super();
    this.#filmsApiServices = filmApiServices;
  }

  getСomments = (id) => this.#filmsApiServices.getComments(id);

  addComment = async (updateType, update) => {
    try {
      const response = await this.#filmsApiServices.addComment(update);
      const film = this.#adaptToClient(response.movie);
      this._notify(updateType, film);
    } catch(err) {
      throw new Error(`Cant't add comment. Error >>> ${err}`);
    }
  };

  deleteComment = async (updateType, update) => {
    try {
      await this.#filmsApiServices.deleteComment(update);
    } catch(err) {
      throw new Error(`Cant't delete comment. Error >>> ${err}`);
    }
    this._notify(updateType);
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
