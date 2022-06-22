import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export default class FilmApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'}).then(ApiService.parseResponse);
  }

  getComments = (id) => this._load({url: `comments/${id}`})
    .then(ApiService.parseResponse)
    .catch(() => []);

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  addComment = async (film, localComment) => {
    const response = await this._load({
      url: `comments/${film}`,
      method: Method.POST,
      body: JSON.stringify(localComment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  deleteComment = async (comment) => {
    const response = await this._load({
      url: `comments/${comment}`,
      method: Method.DELETE,
    });

    return response.status;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {...film,
      'film_info': {...film.filmInfo,
        'alternative_title': film.filmInfo.alternativeTitle,
        'age_rating': film.filmInfo.ageRating,
        'total_rating': film.filmInfo.rate,
        'release': {...film.filmInfo.release,
          'release_country': film.filmInfo.release.releaseCountry,
        },
      },
      'user_details': {...film.userDetails,
        'already_watched': film.userDetails.alreadyWatched,
        'watching_date': film.userDetails.watchingDate,
      }
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.film_info.alternativeTitle;
    delete adaptedFilm.film_info.ageRating;
    delete adaptedFilm.film_info.rate;
    delete adaptedFilm.film_info.release.releaseCountry;
    delete adaptedFilm.userDetails;
    delete adaptedFilm.user_details.alreadyWatched;
    delete adaptedFilm.user_details.watchingDate;

    return adaptedFilm;
  };

}
