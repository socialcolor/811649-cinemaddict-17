import {render, remove, replace} from '../framework/render';
import FilmDetailsView from '../view/film-details-view';
import {setScrollPosition, getScrollPosition} from '../utils/film';

export default class FilmDetailsPresenter {
  film = null;
  #comments = null;
  #changeData = null;
  #localComment = null;

  #filmDetailsView = null;

  constructor (controlsChange) {
    this.#changeData = controlsChange;
  }

  init (film, comments) {
    this.film = {...film};
    this.#comments = [...comments];
    this.#renderDetails();
  }

  closePopup () {
    if(this.#filmDetailsView) {
      document.body.classList.remove('hide-overflow');
      this.#filmDetailsView.element.querySelector('.film-details__close-btn').removeEventListener('click', this.#onCloseClick);
      remove(this.#filmDetailsView);
      document.removeEventListener('keydown', this.#onEscKeyDown);
      this.#filmDetailsView = null;
      this.#localComment = null;
    }
  }

  #renderDetails = () => {
    const scrollPosition = this.#filmDetailsView ? getScrollPosition(this.#filmDetailsView.element) : null;
    const prevFilmDetailsView = this.#filmDetailsView;
    this.#filmDetailsView = new FilmDetailsView(this.film, this.#comments, this.#localComment);

    if(prevFilmDetailsView === null) {
      render(this.#filmDetailsView, document.body);
    } else {
      replace(this.#filmDetailsView, prevFilmDetailsView);
    }

    this.#scrollDetails(scrollPosition);

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#filmDetailsView.setCloseButtonHandler(this.#onCloseClick);
    this.#filmDetailsView.setWatchlistHandler(this.#onWatchListClick);
    this.#filmDetailsView.setWatchedHandler(this.#onWatchedClick);
    this.#filmDetailsView.setFavoriteHandler(this.#onFavoriteClick);
  };

  #scrollDetails = (scrollPosition) => {
    if(scrollPosition) {
      setScrollPosition(this.#filmDetailsView.element, scrollPosition);
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

  #onWatchListClick = (localComment) => {
    this.#localComment = localComment;
    const userDetails = this.film.userDetails;
    const change = {...this.film, userDetails: {...userDetails, watchlist: !userDetails.watchlist}};
    const scrollPosition = this.#filmDetailsView ? getScrollPosition(this.#filmDetailsView.element) : null;
    this.#changeData(change);
    this.#scrollDetails(scrollPosition);
  };

  #onWatchedClick = (localComment) => {
    this.#localComment = localComment;
    const userDetails = this.film.userDetails;
    const change = {...this.film, userDetails: {...userDetails, alreadyWatched: !userDetails.alreadyWatched}};
    const scrollPosition = this.filmDetailsView ? getScrollPosition(this.filmDetailsView.element) : null;
    this.#changeData(change);
    this.#scrollDetails(scrollPosition);
  };

  #onFavoriteClick = (localComment) => {
    this.#localComment = localComment;
    const userDetails = this.film.userDetails;
    const change = {...this.film, userDetails: {...userDetails, favorite: !userDetails.favorite}};
    const scrollPosition = this.filmDetailsView ? getScrollPosition(this.filmDetailsView.element) : null;
    this.#changeData(change);
    this.#scrollDetails(scrollPosition);
  };
}
