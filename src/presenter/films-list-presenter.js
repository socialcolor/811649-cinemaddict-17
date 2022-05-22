import {render, remove} from '../framework/render';
import FilmPresenter from './film-presenter';
import FilterView from '../view/filter-view';
import FilmSectionView from '../view/film-section-view';
import FilmListView from '../view/film-list-view';
import FilmListTitleView from '../view/film-list-title-view';
import FilmListContainerView from '../view/film-list-container-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmMostView from '../view/film-most-view';
import FilmListEmptyView from '../view/film-list-empty-view';
import {updateItem} from '../utils';
import {FILM_COUNT_PER_STEP, TOP_RATED_FILMS, MOST_COMMENTS_FILMS} from '../const';

export default class FilmsListPresenter {
  #mainSection = null;
  #filmModel = null;
  #filmPresenter = new Map();

  #filmSection = new FilmSectionView();
  #filmList = new FilmListView();
  #filmListContainer = new FilmListContainerView();
  #showMoreButton = new ShowMoreButtonView();
  #films = [];
  #comments = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor (container, filmsModel) {
    this.#mainSection = container;
    this.#filmModel = filmsModel;
  }

  init = () => {
    this.#films = [...this.#filmModel.films];
    this.#comments = [...this.#filmModel.comments];

    this.#renderFilmsBoard();
  };

  changeData = (data) => {
    this.#films = updateItem(this.#films, data);
    this.#filmPresenter.get(data.id).forEach((presenter) => presenter.init(data));
  };

  closePopup = () => {
    this.#filmPresenter.forEach((presenters) => presenters.forEach((presenter) => presenter.closePopup()));
  };

  #onShowMoreButtonClick = () => {
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        const filmPresenter = new FilmPresenter(this.#comments, this.#filmListContainer.element, this.changeData, this.closePopup);
        this.#setFilmPresenter(film.id, filmPresenter);
        filmPresenter.init(film);
      });

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      remove(this.#showMoreButton);
    }
  };

  #renderMostFilms = () => {
    const topRated = new FilmMostView('Top rated');
    const mostComment = new FilmMostView('Most commented');
    const topRateFimls = [...this.#films].sort((a, b) => b.filmInfo.rate - a.filmInfo.rate);
    const mostCommentsFilms = [...this.#films].sort((a, b) => b.comments.length - a.comments.length);

    render(topRated, this.#filmSection.element);
    render(mostComment, this.#filmSection.element);

    for(let i = 0; i < TOP_RATED_FILMS; i++) {
      const filmTopRatePresenter = new FilmPresenter(this.#comments, topRated.element.querySelector('.films-list__container'), this.changeData, this.closePopup);
      const topRatedFilm = topRateFimls[i];
      this.#setFilmPresenter(topRatedFilm.id, filmTopRatePresenter);
      filmTopRatePresenter.init(topRatedFilm);
    }
    for(let i = 0; i < MOST_COMMENTS_FILMS; i++) {
      const filmMostCommentedPrestner = new FilmPresenter(this.#comments, mostComment.element.querySelector('.films-list__container'), this.changeData, this.closePopup);
      const mostCommentedFilm = mostCommentsFilms[i];
      this.#setFilmPresenter(mostCommentedFilm.id, filmMostCommentedPrestner);
      filmMostCommentedPrestner.init(mostCommentedFilm);
    }
  };

  #renderFilm = () => {
    if(this.#films.length > 0) {
      render(new FilmListTitleView(), this.#filmList.element);
      render(this.#filmListContainer, this.#filmList.element);

      for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
        const film = this.#films[i];
        const filmPresenter = new FilmPresenter(this.#comments, this.#filmListContainer.element, this.changeData, this.closePopup);
        this.#setFilmPresenter(film.id, filmPresenter);
        filmPresenter.init(film);
      }

      if(this.#films.length > FILM_COUNT_PER_STEP) {
        render(this.#showMoreButton, this.#filmList.element);
        this.#showMoreButton.setShowMoreButtonHandler(this.#onShowMoreButtonClick);
      }

      this.#renderMostFilms();
    } else {
      render(new FilmListEmptyView('There are no movies in our database'), this.#filmList.element);
    }
  };

  #renderFilmsBoard = () => {
    const watchlist = this.#films.filter((film) => film.userDetails.watchlist);
    const favorite = this.#films.filter((film) => film.userDetails.favorite);
    render(new FilterView(watchlist, favorite), this.#mainSection);
    render(this.#filmSection, this.#mainSection);
    render(this.#filmList, this.#filmSection.element);
    this.#renderFilm();
  };

  #setFilmPresenter = (filmId, filmPresenter) => {
    const existingPresenters = this.#filmPresenter.get(filmId);
    if(existingPresenters) {
      existingPresenters.push(filmPresenter);
    } else {
      this.#filmPresenter.set(filmId, [filmPresenter]);
    }
  };
}
