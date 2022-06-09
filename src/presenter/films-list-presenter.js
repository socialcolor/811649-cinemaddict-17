import {render, remove, replace} from '../framework/render';
import FilmPresenter from './film-presenter';
import FilterPresenter from './filter-presenter';
import FilmDetailsPresenter from './film-details-presenter';
import FilmSortView from '../view/film-sort-view';
import RateView from '../view/rate-view';
import FilmSectionView from '../view/film-section-view';
import FilmListView from '../view/film-list-view';
import FilmListTitleView from '../view/film-list-title-view';
import FilmListContainerView from '../view/film-list-container-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmMostView from '../view/film-most-view';
import FilmListEmptyView from '../view/film-list-empty-view';
import FooterStatView from '../view/footer-stat-view';
import {updateItem} from '../utils/utils';
import {FILM_COUNT_PER_STEP, TOP_RATED_FILMS, MOST_COMMENTS_FILMS, SORT_TYPE, FILTERS_TYPE, EMPTY_TEXT} from '../const';
import dayjs from 'dayjs';

export default class FilmsListPresenter {
  #mainSection = null;
  #header = null;
  #footer = null;
  #filmModel = null;
  #filterPresenter = null;
  #filmDetailsPresenter = null;
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
  #watchlistFilms = [];
  #alreadyWatchedFilms = [];
  #favoriteFilms = [];
  #filtresSortByDefault = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;


  constructor (container, header, footer, filmsModel) {
    this.#mainSection = container;
    this.#header = header;
    this.#footer = footer;
    this.#filmModel = filmsModel;
  }

  get films() {
    return  this.#filmModel.films;
  }

  get comments() {
    return  this.#filmModel.comments;
  }

  init = () => {
    this.#films = [...this.#filmModel.films];
    this.#sourceFilms = [...this.#filmModel.films];
    this.#comments = [...this.#filmModel.comments];

    this.#filterFilms();
    render(new FooterStatView(this.#filmModel.films.length), this.#footer);
    this.#renderFilmsBoard(this.#filmModel.films.length);
  };

  changeData = (data) => {
    const copyData = Object.assign(data);
    this.#films = updateItem(this.#films, copyData);
    this.#sourceFilms = updateItem(this.#sourceFilms, copyData);
    this.#filmPresenters.get(data.id).forEach((presenter) => presenter.init(data));

    const oldFilmFilters = this.#getCountFilmsInFilters();
    this.#filterFilms();
    const currentFilmFilters = this.#getCountFilmsInFilters();

    if (oldFilmFilters.watchlist !== currentFilmFilters.watchlist || oldFilmFilters.alreadyWatched !== currentFilmFilters.alreadyWatched || oldFilmFilters.favorite !== currentFilmFilters.favorite) {
      this.#filterPresenter.init(currentFilmFilters, this.#currentFilter);
      this.#setFilteredFilms();
      this.#clearFilmsBoard();
      this.#renderFilmsBoard();
    }

    if (data.id === this.#filmDetailsPresenter.film.id) {
      this.#filmDetailsPresenter.init(data, this.#comments);
    }
  };

  changeFilter = (activeFilter) => {
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    if(this.#currentFilter === activeFilter) {
      return;
    }

    this.#currentFilter = activeFilter;
    this.#currentSort = SORT_TYPE.DEFAULT;

    this.#filterFilms();
    this.#setFilteredFilms();

    const filmFilters = this.#getCountFilmsInFilters();
    this.#filtresSortByDefault = [...this.#films];
    this.#filterPresenter.init(filmFilters, this.#currentFilter);
    this.#clearFilmsBoard();
    this.#renderFilmsBoard();
  };

  #changeSort = (sort) => {
    this.#currentSort = sort;

    this.#setSortedFilms();

    this.#clearFilmsBoard();
    this.#renderFilmsBoard();
  };

  #filterFilms = () => {
    this.#watchlistFilms = this.#sourceFilms.filter((film) => film.userDetails.watchlist);
    this.#alreadyWatchedFilms = this.#sourceFilms.filter((film) => film.userDetails.alreadyWatched);
    this.#favoriteFilms = this.#sourceFilms.filter((film) => film.userDetails.favorite);
  };

  #onShowMoreButtonClick = () => {
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        const filmPresenter = new FilmPresenter(this.#filmListContainer.element, this.changeData, this.#openDetailsFilm);
        this.#setFilmPresenter(film.id, filmPresenter);
        filmPresenter.init(film);
      });

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;
    if (this.#renderedFilmCount >= this.#films.length) {
      this.#removeShowMoreButton();
    }
  };

  #getCountFilmsInFilters = () => ({
    watchlist: this.#watchlistFilms.length,
    alreadyWatched: this.#alreadyWatchedFilms.length,
    favorite: this.#favoriteFilms.length
  });

  #setFilmPresenter = (filmId, filmPresenter) => {
    const existingPresenters = this.#filmPresenters.get(filmId);
    if(existingPresenters) {
      existingPresenters.push(filmPresenter);
    } else {
      this.#filmPresenters.set(filmId, [filmPresenter]);
    }
  };

  #setFilteredFilms = () => {
    switch (this.#currentFilter) {
      case FILTERS_TYPE.WATCHLIST:
        this.#films = this.#watchlistFilms;
        break;
      case FILTERS_TYPE.HISTORY:
        this.#films =  this.#alreadyWatchedFilms;
        break;
      case FILTERS_TYPE.FAVORITES:
        this.#films = this.#favoriteFilms;
        break;
      default:
        this.#films = [...this.#sourceFilms];
        break;
    }
  };

  #setSortedFilms = () => {
    switch (this.#currentSort) {
      case SORT_TYPE.RATING:
        this.#films.sort((a, b) => b.filmInfo.rate - a.filmInfo.rate);
        break;
      case SORT_TYPE.DATE:
        this.#films.sort((a, b) => dayjs(b.filmInfo.release.date) - dayjs(a.filmInfo.release.date));
        break;
      case SORT_TYPE.DEFAULT:
        if(this.#films.length === this.#filtresSortByDefault.length) {
          this.#films = this.#currentFilter !== FILTERS_TYPE.ALL ?  this.#films = [...this.#filtresSortByDefault] :  this.#films = [...this.#sourceFilms];
        }
        break;
    }
  };

  #openDetailsFilm = (film) => {
    if(!this.#filmDetailsPresenter) {
      this.#filmDetailsPresenter = new FilmDetailsPresenter(this.changeData);
      this.#filmDetailsPresenter.init(film, this.#comments);
    }
    this.#filmDetailsPresenter.init(film, this.#comments);
  };

  closePopup = () => {
    this.#filmDetailsPresenter.closePopup();
    this.#filmDetailsPresenter = null;
  };

  #removeFilmsListEmpty = () => remove(this.#filmListEmpty);

  #removeShowMoreButton = () => remove(this.#showMoreButton);

  #removeExtraBlocks = () => {
    remove(this.#topRated);
    remove(this.#mostComment);
  };

  #removeSort = () => {
    remove(this.#sortView);
    this.#sortView = null;
  };

  #clearFilmsBoard = () => {
    this.#destroyFilmsPresenters();
    this.#removeSort();
    this.#removeShowMoreButton();
    this.#removeExtraBlocks();

    if (this.#filmListEmpty) {
      remove(this.#filmListEmpty);
      this.#filmListEmpty = null;
    }
  };

  #destroyFilmsPresenters = () => this.#filmPresenters.forEach((presenters) => presenters.forEach((presenter) => presenter.destroy()));

  #renderUserRate = () => {
    const rate = this.#alreadyWatchedFilms.length;
    if(this.#userRate) {
      remove(this.#userRate);
      this.#userRate = new RateView(rate);
      render(this.#userRate, this.#header);
    } else {
      this.#userRate = new RateView(rate);
      render(this.#userRate, this.#header);
    }
  };

  #renderFilter = () => {
    const filmFilters = this.#getCountFilmsInFilters();
    if(!this.#filterPresenter) {
      this.#filterPresenter = new FilterPresenter(this.#mainSection, this.changeFilter);
    }
    this.#filterPresenter.init(filmFilters, this.#currentFilter);
  };

  #renderSort = () => {
    const prevSortView = this.#sortView;

    this.#sortView = new FilmSortView(this.#currentSort);
    this.#sortView.setSortClickHandler(this.#changeSort);

    if(prevSortView === null) {
      render(this.#sortView, this.#mainSection);
    } else {
      replace(this.#sortView, prevSortView);
    }
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(container, this.changeData, this.#openDetailsFilm);
    this.#setFilmPresenter(film.id, filmPresenter);
    filmPresenter.init(film);
  };

  #renderFilms = () => {
    if(this.#films.length > 0) {
      render(new FilmListTitleView(), this.#filmList.element);
      render(this.#filmListContainer, this.#filmList.element);
      const renderLength = this.#films.length > FILM_COUNT_PER_STEP ? this.#renderedFilmCount : this.#films.length;

      for (let i = 0; i < renderLength; i++) {
        this.#renderFilm(this.#films[i], this.#filmListContainer.element);
      }
      this.#renderedFilmCount = renderLength;
    }
  };

  #rednerFilmListEmpty = () => {
    this.#removeFilmsListEmpty();
    const text = EMPTY_TEXT[this.#currentFilter.toUpperCase()];
    this.#filmListEmpty = new FilmListEmptyView(text);
    render(this.#filmListEmpty, this.#filmList.element);
  };

  #renderShowMoreButton = () => {
    if(this.#films.length > FILM_COUNT_PER_STEP && this.#renderedFilmCount < this.#films.length) {
      this.#showMoreButton.setShowMoreButtonHandler(this.#onShowMoreButtonClick);
      render(this.#showMoreButton, this.#filmList.element);
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
        this.#renderFilm(topRateFimls[i], this.#topRated.element.querySelector('.films-list__container'));
      }
    }

    if(mostCommentsFilms.length) {
      render(this.#mostComment, this.#filmSection.element);
      for(let i = 0; i < MOST_COMMENTS_FILMS; i++) {
        this.#renderFilm(mostCommentsFilms[i], this.#mostComment.element.querySelector('.films-list__container'));
      }
    }
  };

  #renderFilmsBoard = () => {
    this.#renderUserRate();
    this.#renderFilter();
    this.#renderSort();
    render(this.#filmSection, this.#mainSection);
    render(this.#filmList, this.#filmSection.element);

    if (this.#films.length === 0) {
      this.#removeSort();
      this.#rednerFilmListEmpty();
      return;
    }
    this.#renderFilms(this.#films);
    this.#renderShowMoreButton(this.#films);
    this.#renderExtraBlock();
  };
}
