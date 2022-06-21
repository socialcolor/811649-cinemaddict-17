import {render, remove, replace} from '../framework/render';
import FilmDetailsView from '../view/film-details-view';
import {UserAction, UpdateType} from '../const.js';

export default class FilmDetailsPresenter {
  #film = null;
  #comments = null;
  #changeData = null;
  #isOpened = false;

  #filmDetailsView = null;
  #scrollPosition = 0;

  constructor (controlsChange) {
    this.#changeData = controlsChange;
  }

  init = (film, comments) => {
    this.#film = film;
    this.#comments = comments;
    this.#renderDetails();
  };

  get filmId () {
    return this.#film.id;
  }

  get isOpened () {
    return this.#isOpened;
  }

  setDeleting = (id, scrollPosition) => {
    this.#filmDetailsView.updateElement({
      isDisabled: true,
      isDeleting: true,
      deletingComment: id,
    });
    this.setScrollPosition(scrollPosition);
  };

  setSaving = (scrollPosition) => {
    this.#filmDetailsView.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
    this.setScrollPosition(scrollPosition);
  };

  setAborting = (scrollPosition) => {
    const resetFormState = () => {
      this.#filmDetailsView.updateElement({
        isDisabled: false,
        isDeleting: false,
      });
      this.setScrollPosition(scrollPosition);
    };
    this.setScrollPosition(scrollPosition);
    this.#filmDetailsView.shake(resetFormState);
  };

  getScrollPosition = () => this.#filmDetailsView.element.scrollTop;

  setScrollPosition = (scrollPosition) => (this.#filmDetailsView.element.scrollTop = scrollPosition ? scrollPosition : this.#scrollPosition);

  closePopup = () => {
    if(this.#filmDetailsView) {
      document.body.classList.remove('hide-overflow');
      this.#filmDetailsView.element.querySelector('.film-details__close-btn').removeEventListener('click', this.#onCloseClick);
      remove(this.#filmDetailsView);
      document.removeEventListener('keydown', this.#onEscKeyDown);
      this.#filmDetailsView = null;
    }
    this.#isOpened = false;
  };

  #renderDetails = () => {
    const prevFilmDetailsView = this.#filmDetailsView;

    if(prevFilmDetailsView !== null) {
      const filmInfo = this.#filmDetailsView.comment;
      this.#filmDetailsView = new FilmDetailsView(this.#film, this.#comments);
      replace(this.#filmDetailsView, prevFilmDetailsView);
      this.#filmDetailsView.updateElement(filmInfo);
    } else {
      this.#filmDetailsView = new FilmDetailsView(this.#film, this.#comments);
      render(this.#filmDetailsView, document.body);
    }

    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#filmDetailsView.setDeleteCommentHandler(this.#onDeletClick);
    this.#filmDetailsView.setAddCommentHandler(this.#onAddCommentClick);
    this.#filmDetailsView.setCloseButtonHandler(this.#onCloseClick);
    this.#filmDetailsView.setWatchlistHandler(this.#onWatchListClick);
    this.#filmDetailsView.setWatchedHandler(this.#onWatchedClick);
    this.#filmDetailsView.setFavoriteHandler(this.#onFavoriteClick);
    this.#isOpened = true;
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

  #onAddCommentClick = (film) => {
    this.#changeData(UserAction.ADD_COMMENT, UpdateType.MINOR, film);
  };

  #onDeletClick = (film, commentId) => {
    this.#changeData(UserAction.DELETE_COMMENT, UpdateType.MINOR, {...film, commentId: commentId});
  };

  #onWatchListClick = () => {
    const change = {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}};
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, change);
  };

  #onWatchedClick = () => {
    const change = {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}};
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, change);
  };

  #onFavoriteClick = () => {
    const change = {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}};
    this.#changeData(UserAction.UPDATE_FILM, UpdateType.PATCH, change);
  };
}
