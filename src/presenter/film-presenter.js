import {render, remove, replace} from '../framework/render';
import FilmItemView from '../view/film-item-view';
import FilmDetailsView from '../view/film-details-view';
import FilmDetailsCommentView from '../view/film-details-comments.view';


export default class FilmPresenter {
  #comments = null;
  #container = null;
  #changeData = null;
  #closePopup = null;

  #film = null;
  #filmView = null;
  #filmDetailsView = null;

  constructor (comments, container, controlsChange, closePopup) {
    this.#comments = [...comments];
    this.#container = container;
    this.#changeData = controlsChange;
    this.#closePopup = closePopup;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmView = this.#filmView;

    this.#filmView = new FilmItemView(film);
    this.#filmDetailsView = new FilmDetailsView(film);

    this.#filmView.setFilmLinkHandler(this.#openPopup);
    this.#filmView.setWatchlistHandler(this.#onWatchListClick);
    this.#filmView.setWatchedHandler(this.#onWatchedClick);
    this.#filmView.setFavoriteHandler(this.#onFavoriteClick);

    if(prevFilmView === null) {
      render(this.#filmView, this.#container);
    } else {
      replace(this.#filmView, prevFilmView);
    }
  };


  #renderDetails = () => {
    render(this.#filmDetailsView, document.body);
    this.#filmDetailsView.setWatchlistHandler(this.#onWatchListDetailsClick);
    this.#filmDetailsView.setWatchedHandler(this.#onWatchedDetailsClick);
    this.#filmDetailsView.setFavoriteHandler(this.#onFavoriteDetailsClick);
    const commentsContainer = this.#filmDetailsView.element.querySelector('.film-details__comments-list');

    for(let i = 0; i < this.#film.comments.length; i++) {
      const commentsId = this.#comments[i];
      render(new FilmDetailsCommentView(commentsId), commentsContainer);
    }
  };

  #onCloseClick = () => {
    this.closePopup();
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.closePopup();
    }
  };

  closePopup = function closePopup () {
    document.body.classList.remove('hide-overflow');
    this.#filmDetailsView.element.querySelector('.film-details__close-btn').removeEventListener('click', this.#onCloseClick);
    remove(this.#filmDetailsView);
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #openPopup = () => {
    this.#closePopup();
    this.#renderDetails();
    document.body.classList.add('hide-overflow');

    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#filmDetailsView.seCloseButtonHandler(this.#onCloseClick);
  };

  #onWatchListDetailsClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, watchlist: !userDetails.watchlist}};
    this.#changeData(change);
    this.#renderDetails();
  };

  #onWatchedDetailsClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, alreadyWatched: !userDetails.alreadyWatched}};
    this.#changeData(change);
    this.#renderDetails();
  };

  #onFavoriteDetailsClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, favorite: !userDetails.favorite}};
    this.#changeData(change);
    this.#renderDetails();
  };

  #onWatchListClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, watchlist: !userDetails.watchlist}};
    this.#changeData(change);
  };

  #onWatchedClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, alreadyWatched: !userDetails.alreadyWatched}};
    this.#changeData(change);
  };

  #onFavoriteClick = () => {
    const userDetails = this.#film.userDetails;
    const change = {...this.#film, userDetails: {...userDetails, favorite: !userDetails.favorite}};
    this.#changeData(change);
  };

}
