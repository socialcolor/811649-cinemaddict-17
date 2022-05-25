import {render, remove, replace} from '../framework/render';
import FilmPresenter from './film-presenter';
import FilterPresenter from './filter-presenter';
import FilmSortView from '../view/film-sort-view';
import RateView from '../view/rate-view';
import FilmSectionView from '../view/film-section-view';
import FilmListView from '../view/film-list-view';
import FilmListTitleView from '../view/film-list-title-view';
import FilmListContainerView from '../view/film-list-container-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmMostView from '../view/film-most-view';
import FilmListEmptyView from '../view/film-list-empty-view';
import {updateItem} from '../utils';
import {FILM_COUNT_PER_STEP, TOP_RATED_FILMS, MOST_COMMENTS_FILMS, SORT_TYPE, FILTERS_TYPE} from '../const';
import dayjs from 'dayjs';

export default class FilmsListPresenter {
  #mainSection = null;
  #header = null;
  #filmModel = null;
  #filterPresenter = null;
  #filmPresenters = new Map();

  #sortView = null;
  #filmSection = new FilmSectionView();
  #filmList = new FilmListView();
  #filmListContainer = new FilmListContainerView();
  #showMoreButton = new ShowMoreButtonView();
  #topRated = null;
  #mostComment = null;
  #films = [];
  #sourceFilms = [];
  #comments = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor (container, header, filmsModel) {
    this.#mainSection = container;
    this.#header = header;
    this.#filmModel = filmsModel;
  }

  init = () => {
    this.#films = [...this.#filmModel.films];
    this.#sourceFilms = [...this.#filmModel.films];
    this.#comments = [...this.#filmModel.comments];

    const rate = this.#films.filter((film) => film.userDetails.alreadyWatched).length;
    render(new RateView(rate), this.#header);
    this.#renderFilter(this.#films, FILTERS_TYPE.DEFAULT);
    this.#renderFilmsBoard();
  };

  changeData = (data) => {
    this.#films = updateItem(this.#films, data);
    this.#filterPresenter.init(this.#films);
    this.#filmPresenters.get(data.id).forEach((presenter) => presenter.init(data));
  };

  sortChange = (sort) => {
    switch (sort) {
      case SORT_TYPE.RATING:
        this.#clearFilms();
        this.#films.sort((a, b) => b.filmInfo.rate - a.filmInfo.rate);
        this.#renderFilmsBoard(sort);
        break;
      case SORT_TYPE.DATE:
        this.#films.sort((a, b) => dayjs(b.filmInfo.release.date) - dayjs(a.filmInfo.release.date));
        this.#clearFilms();
        this.#renderFilmsBoard(sort);
        break;
      case SORT_TYPE.DEFAULT:
        this.#clearFilms();
        this.#films = [...this.#sourceFilms];
        this.#renderFilmsBoard(sort);
        break;
    }
  };

  changeFilter = (activeFilter) => {
    switch (activeFilter) {
      case FILTERS_TYPE.WATCHLIST:
        this.#filterPresenter.init(this.#films, activeFilter);
        break;
      case FILTERS_TYPE.HISTORY:
        this.#filterPresenter.init(this.#films, activeFilter);
        break;
      case FILTERS_TYPE.FAVORITES:
        this.#filterPresenter.init(this.#films, activeFilter);
        break;
      default:
        this.#filterPresenter.init(this.#films, activeFilter);
        break;
    }
  };

  #clearFilms = () => {
    this.#filmPresenters.forEach((presenters) => presenters.forEach((presenter) => presenter.destroy()));
    remove(this.#showMoreButton);
    remove(this.#topRated);
    remove(this.#mostComment);
  };

  closePopup = () => {
    this.#filmPresenters.forEach((presenters) => presenters.forEach((presenter) => presenter.closePopup()));
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

  #setFilmPresenter = (filmId, filmPresenter) => {
    const existingPresenters = this.#filmPresenters.get(filmId);
    if(existingPresenters) {
      existingPresenters.push(filmPresenter);
    } else {
      this.#filmPresenters.set(filmId, [filmPresenter]);
    }
  };

  #renderMostFilms = () => {
    this.#topRated = new FilmMostView('Top rated');
    this.#mostComment = new FilmMostView('Most commented');
    const topRateFimls = [...this.#films].sort((a, b) => b.filmInfo.rate - a.filmInfo.rate);
    const mostCommentsFilms = [...this.#films].sort((a, b) => b.comments.length - a.comments.length);

    render(this.#topRated, this.#filmSection.element);
    render(this.#mostComment, this.#filmSection.element);

    for(let i = 0; i < TOP_RATED_FILMS; i++) {
      const filmTopRatePresenter = new FilmPresenter(this.#comments, this.#topRated.element.querySelector('.films-list__container'), this.changeData, this.closePopup);
      const topRatedFilm = topRateFimls[i];
      this.#setFilmPresenter(topRatedFilm.id, filmTopRatePresenter);
      filmTopRatePresenter.init(topRatedFilm);
    }
    for(let i = 0; i < MOST_COMMENTS_FILMS; i++) {
      const filmMostCommentedPrestner = new FilmPresenter(this.#comments, this.#mostComment.element.querySelector('.films-list__container'), this.changeData, this.closePopup);
      const mostCommentedFilm = mostCommentsFilms[i];
      this.#setFilmPresenter(mostCommentedFilm.id, filmMostCommentedPrestner);
      filmMostCommentedPrestner.init(mostCommentedFilm);
    }
  };

  #renderFilter = () => {
    this.#filterPresenter = new FilterPresenter(this.#mainSection, this.changeFilter);
    this.#filterPresenter.init(this.#films);
  };

  #renderSort = (sort = SORT_TYPE.DEFAULT) => {
    const prevSortView = this.#sortView;

    this.#sortView = new FilmSortView(sort);
    this.#sortView.setSortClickHandler(this.sortChange);

    if(prevSortView === null) {
      render(this.#sortView, this.#mainSection);
    } else {
      replace(this.#sortView, prevSortView);
    }
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#comments, this.#filmListContainer.element, this.changeData, this.closePopup);
    this.#setFilmPresenter(film.id, filmPresenter);
    filmPresenter.init(film);
  };

  #renderFilms = (films) => {
    if(films.length > 0) {
      render(new FilmListTitleView(), this.#filmList.element);
      render(this.#filmListContainer, this.#filmList.element);

      for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderFilm(films[i]);
      }
    }
  };

  #renderShowMoreButton = (films) => {
    if(films.length > FILM_COUNT_PER_STEP) {
      this.#showMoreButton.setShowMoreButtonHandler(this.#onShowMoreButtonClick);
      render(this.#showMoreButton, this.#filmList.element);
    }
    if(films.length === 0) {
      render(new FilmListEmptyView('There are no movies in our database'), this.#filmList.element);
    }
  };

  #renderFilmsBoard = (sort) => {
    this.#renderSort(sort);
    render(this.#filmSection, this.#mainSection);
    render(this.#filmList, this.#filmSection.element);
    this.#renderFilms(this.#films);
    this.#renderShowMoreButton(this.#films);
    this.#renderMostFilms();
  };
}
