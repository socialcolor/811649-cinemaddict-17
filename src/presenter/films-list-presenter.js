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

  #currentFilter = FILTERS_TYPE.ALL;
  #currentSort = SORT_TYPE.DEFAULT;

  #userRate = null;
  #sortView = null;
  #filmSection = new FilmSectionView();
  #filmList = new FilmListView();
  #filmListContainer = new FilmListContainerView();
  #showMoreButton = new ShowMoreButtonView();
  #filmListEmpty = null;
  #topRated = null;
  #mostComment = null;
  #films = [];
  #comments = [];
  #sourceFilms = [];
  #filtresSortByDefault = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #showMoreLenght = null;

  constructor (container, header, filmsModel) {
    this.#mainSection = container;
    this.#header = header;
    this.#filmModel = filmsModel;
  }

  init = () => {
    this.#films = [...this.#filmModel.films];
    this.#sourceFilms = [...this.#filmModel.films];
    this.#comments = [...this.#filmModel.comments];

    this.#renderFilmsBoard();
  };

  changeData = (data) => {
    const copyData = Object.assign(data);
    this.#films = updateItem(this.#films, copyData);
    this.#sourceFilms = updateItem(this.#sourceFilms, copyData);
    this.#filmPresenters.get(data.id).forEach((presenter) => presenter.init(data));
    //Если я тут запускаю clearFilms и renderFilmsBoard, то выполняется двойная работа,строкой выше мы уже перерендеририли все фильмы,
    //зачем их удалять и потом опять рендерить уже всю страницу?
  };

  #sortChange = (sort) => {
    this.#currentSort = sort;
    switch (sort) {
      case SORT_TYPE.RATING:
        this.#films.sort((a, b) => b.filmInfo.rate - a.filmInfo.rate);
        break;
      case SORT_TYPE.DATE:
        this.#films.sort((a, b) => dayjs(b.filmInfo.release.date) - dayjs(a.filmInfo.release.date));
        break;
      case SORT_TYPE.DEFAULT:
        this.#films = this.#currentFilter !== FILTERS_TYPE.ALL ?  this.#films = [...this.#filtresSortByDefault] :  this.#films = [...this.#sourceFilms];
        break;
    }
    this.#clearFilms();
    this.#renderFilmsBoard(sort);
  };

  changeFilter = (activeFilter) => {
    //Блок switchCase мне нужен чтобы при мутировать фильмы, т.к. при измнении changeData (даже если я буду по новой всю тсраницу рендерить), у меня не отфильтруются фильмы
    this.#currentFilter = activeFilter;
    switch (activeFilter) {
      case FILTERS_TYPE.WATCHLIST:
        this.#films = this.#sourceFilms.filter((film) => film.userDetails.watchlist);
        break;
      case FILTERS_TYPE.HISTORY:
        this.#films = this.#sourceFilms.filter((film) => film.userDetails.alreadyWatched);
        break;
      case FILTERS_TYPE.FAVORITES:
        this.#films = this.#sourceFilms.filter((film) => film.userDetails.favorite);
        break;
      default:
        this.#films = [...this.#sourceFilms];
        break;
    }
    this.#currentSort = SORT_TYPE.DEFAULT;
    const filmFilters = this.#countFilmsInFilters();
    this.#filtresSortByDefault = [...this.#films];
    this.#filterPresenter.init(filmFilters, this.#currentFilter);
    this.#showMoreLenght = this.#renderedFilmCount;
    this.#clearFilms();
    this.#renderFilmsBoard();
  };

  #clearFilms = () => {
    this.#destroyFilmsPresenters();
    this.#removeShowMoreButton();
    this.#removeExtraBlocks();
  };

  #destroyFilmsPresenters = () => this.#filmPresenters.forEach((presenters) => presenters.forEach((presenter) => presenter.destroy()));

  #removeShowMoreButton = () => remove(this.#showMoreButton);

  #removeExtraBlocks = () => {
    remove(this.#topRated);
    remove(this.#mostComment);
  };

  closePopup = () => this.#filmPresenters.forEach((presenters) => presenters.forEach((presenter) => presenter.closePopup()));

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
      this.#removeShowMoreButton();
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

  #removeFilmsListEmpty = () => remove(this.#filmListEmpty);

  #countFilmsInFilters = () => ({
    watchlist: this.#sourceFilms.filter((film) => film.userDetails.watchlist).length,
    alreadyWatched: this.#sourceFilms.filter((film) => film.userDetails.alreadyWatched).length,
    favorite: this.#sourceFilms.filter((film) => film.userDetails.favorite).length
  });

  #renderUserRate = () => {
    const rate = this.#sourceFilms.filter((film) => film.userDetails.alreadyWatched).length;
    if(this.#userRate) {
      remove(this.#userRate);
      this.#userRate = new RateView(rate);
      render(this.#userRate, this.#header);
    } else {
      this.#userRate = new RateView(rate);
      render(this.#userRate, this.#header);
    }
  };

  #renderExtraBlock = () => {
    this.#topRated = new FilmMostView('Top rated');
    this.#mostComment = new FilmMostView('Most commented');
    const topRateFimls = [...this.#sourceFilms].sort((a, b) => b.filmInfo.rate - a.filmInfo.rate);
    const mostCommentsFilms = [...this.#sourceFilms].sort((a, b) => b.comments.length - a.comments.length);

    if(topRateFimls.length) {
      render(this.#topRated, this.#filmSection.element);
      for(let i = 0; i < TOP_RATED_FILMS; i++) {
        const filmTopRatePresenter = new FilmPresenter(this.#comments, this.#topRated.element.querySelector('.films-list__container'), this.changeData, this.closePopup);
        const topRatedFilm = topRateFimls[i];
        this.#setFilmPresenter(topRatedFilm.id, filmTopRatePresenter);
        filmTopRatePresenter.init(topRatedFilm);
      }
    }

    if(mostCommentsFilms.length) {
      render(this.#mostComment, this.#filmSection.element);
      for(let i = 0; i < MOST_COMMENTS_FILMS; i++) {
        const filmMostCommentedPrestner = new FilmPresenter(this.#comments, this.#mostComment.element.querySelector('.films-list__container'), this.changeData, this.closePopup);
        const mostCommentedFilm = mostCommentsFilms[i];
        this.#setFilmPresenter(mostCommentedFilm.id, filmMostCommentedPrestner);
        filmMostCommentedPrestner.init(mostCommentedFilm);
      }
    }
  };

  #renderFilter = () => {
    const filmFilters = this.#countFilmsInFilters();
    if(!this.#filterPresenter) {
      this.#filterPresenter = new FilterPresenter(this.#mainSection, this.changeFilter);
    }
    this.#filterPresenter.init(filmFilters, this.#currentFilter);
  };

  #renderSort = () => {
    const prevSortView = this.#sortView;

    this.#sortView = new FilmSortView(this.#currentSort);
    this.#sortView.setSortClickHandler(this.#sortChange);

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

      // const renderLength = this.#showMoreLenght === null ? Math.min(films.length, FILM_COUNT_PER_STEP) : this.#showMoreLenght;

      for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderFilm(films[i]);
      }
    }
  };

  #rednerFilmListEmpty = () => {
    this.#removeFilmsListEmpty();

    this.#filmListEmpty = new FilmListEmptyView('There are no movies in our database');
    render(this.#filmListEmpty, this.#filmList.element);
  };

  #renderShowMoreButton = (films) => {
    this.#removeFilmsListEmpty();

    if(films.length > FILM_COUNT_PER_STEP) {
      this.#showMoreButton.setShowMoreButtonHandler(this.#onShowMoreButtonClick);
      render(this.#showMoreButton, this.#filmList.element);
    }

    if(films.length === 0) {
      this.#rednerFilmListEmpty();
    }
  };

  #renderFilmsBoard = () => {
    this.#renderUserRate();
    this.#renderFilter();
    this.#renderSort();
    render(this.#filmSection, this.#mainSection);
    render(this.#filmList, this.#filmSection.element);
    this.#renderFilms(this.#films);
    this.#renderShowMoreButton(this.#films);
    this.#renderExtraBlock();
  };
}
