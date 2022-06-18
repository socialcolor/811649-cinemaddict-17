import {render, remove} from '../framework/render';
import FilmPresenter from './film-presenter';
import FilmDetailsPresenter from './film-details-presenter';
import FilmLoadingView from '../view/film-loading-view';
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
import {FILM_COUNT_PER_STEP, TOP_RATED_FILMS, MOST_COMMENTS_FILMS, SORT_TYPE, FILTERS_TYPE, EMPTY_TEXT, UpdateType, UserAction} from '../const';
import dayjs from 'dayjs';
import { filter } from '../utils/filter';

export default class FilmsListPresenter {
  #mainSection = null;
  #header = null;
  #footer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #filmDetailsPresenter = null;
  #filmPresenters = new Map();

  #userRate = null;
  #sortView = null;
  #filmSection = new FilmSectionView();
  #filmList = new FilmListView();
  #filmLoading = new FilmLoadingView();
  #filmListContainer = new FilmListContainerView();
  #showMoreButton = new ShowMoreButtonView();
  #filmTitle = null;
  #filmListEmpty = null;
  #topRated = null;
  #mostComment = null;
  #filmCountFooter = null;
  #isLoading = true;

  #currentFilter = FILTERS_TYPE.ALL;
  #currentSort = SORT_TYPE.DEFAULT;
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor (container, header, footer, filmsModel, commentsModel, filterModel) {
    this.#mainSection = container;
    this.#header = header;
    this.#footer = footer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);
    this.#commentsModel.addObserver(this.#onModelEvent);
  }

  get films() {
    const films = this.#filmsModel.films;
    const filterType = this.#filterModel.filter;
    const filtredFilms = filter[filterType](films);

    switch (this.#currentSort) {
      case SORT_TYPE.RATING:
        return filtredFilms.sort((a, b) => b.filmInfo.rate - a.filmInfo.rate);
      case SORT_TYPE.DATE:
        return filtredFilms.sort((a, b) => dayjs(b.filmInfo.release.date) - dayjs(a.filmInfo.release.date));
      case SORT_TYPE.DEFAULT:
      default:
        return filtredFilms;
    }

  }

  init = () => {
    this.#renderFilmsBoard();
  };

  #setFilmPresenter = (filmId, filmPresenter) => {
    const existingPresenters = this.#filmPresenters.get(filmId);
    if(existingPresenters) {
      existingPresenters.push(filmPresenter);
    } else {
      this.#filmPresenters.set(filmId, [filmPresenter]);
    }
  };

  #renderLoading = () => {
    render(this.#filmLoading, this.#mainSection);
  };

  #renderUserRate = () => {
    const rate = filter[FILTERS_TYPE.HISTORY](this.#filmsModel.films).length;
    if(this.#userRate) {
      remove(this.#userRate);
      this.#userRate = new RateView(rate);
      render(this.#userRate, this.#header);
    } else {
      this.#userRate = new RateView(rate);
      render(this.#userRate, this.#header);
    }
  };

  #renderSort = () => {
    this.#sortView = new FilmSortView(this.#currentSort);
    this.#sortView.setSortClickHandler(this.#onChangeSort);

    render(this.#sortView, this.#mainSection);
  };

  #rednerFilmListEmpty = () => {
    const text = EMPTY_TEXT[this.#filterModel.filter.toUpperCase()];
    this.#filmListEmpty = new FilmListEmptyView(text);
    render(this.#filmListEmpty, this.#filmList.element);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButton.setShowMoreButtonHandler(this.#onShowMoreButtonClick);
    render(this.#showMoreButton, this.#filmList.element);
  };

  #renderExtraBlock = () => {
    const topRateFimls = [...this.#filmsModel.films].sort((a, b) => b.filmInfo.rate - a.filmInfo.rate);
    const mostCommentsFilms = [...this.#filmsModel.films].sort((a, b) => b.comments.length - a.comments.length);

    if(topRateFimls.length) {
      this.#topRated = new FilmMostView('Top rated');
      render(this.#topRated, this.#filmSection.element);
      for(let i = 0; i < TOP_RATED_FILMS; i++) {
        this.#renderFilm(topRateFimls[i], this.#topRated.element.querySelector('.films-list__container'));
      }
    }

    if(mostCommentsFilms.length) {
      this.#mostComment = new FilmMostView('Most commented');
      render(this.#mostComment, this.#filmSection.element);
      for(let i = 0; i < MOST_COMMENTS_FILMS; i++) {
        this.#renderFilm(mostCommentsFilms[i], this.#mostComment.element.querySelector('.films-list__container'));
      }
    }
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(container, this.#onViewAction, this.#openPopup);
    this.#setFilmPresenter(film.id, filmPresenter);
    filmPresenter.init(film);
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film, this.#filmListContainer.element));
  };

  #renderFilmsBoard = () => {
    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const films = this.films;
    const filmCount = films.length;

    this.#renderUserRate();
    this.#renderSort();
    render(this.#filmSection, this.#mainSection);
    render(this.#filmList, this.#filmSection.element);
    render(this.#filmListContainer, this.#filmList.element);
    this.#filmTitle = new FilmListTitleView(this.#currentFilter);
    render(this.#filmTitle, this.#filmList.element);
    if (filmCount === 0) {
      remove(this.#sortView);
      this.#rednerFilmListEmpty();
    } else {
      this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));
      if(filmCount > FILM_COUNT_PER_STEP && this.#renderedFilmCount < filmCount.length) {
        this.#renderShowMoreButton();
      }
    }

    this.#renderExtraBlock();
  };

  #clearFilmsBoard = ({resetRenderetFilmCount = false, resetSortType = false} = {}) => {
    this.#filmPresenters.forEach((presenters) => presenters.forEach((presenter) => presenter.destroy()));
    this.#filmPresenters.clear();
    remove(this.#sortView);
    remove(this.#showMoreButton);
    remove(this.#filmListEmpty);
    remove(this.#topRated);
    remove(this.#mostComment);

    if(resetRenderetFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSort = SORT_TYPE.DEFAULT;
    }
  };

  #closePopup = () => {
    if(this.#filmDetailsPresenter && this.#filmDetailsPresenter.isOpened) {
      this.#filmDetailsPresenter.closePopup();
      this.#filmDetailsPresenter = null;
    }
  };

  #openPopup = async (film) => {
    let scrollPosition = null;
    if(this.#filmDetailsPresenter && this.#filmDetailsPresenter.isOpened) {
      scrollPosition = this.#filmDetailsPresenter.getScrollPosition();
      this.#closePopup();
    }
    this.#filmDetailsPresenter = new FilmDetailsPresenter(this.#onViewAction);
    this.#filmDetailsPresenter.init(film, await this.#commentsModel.getСomments(film.id));
    this.#filmDetailsPresenter.setScrollPosition(scrollPosition);
  };

  #onViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
    }
  };

  #onModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if(this.#filterModel.filter === FILTERS_TYPE.ALL) {
          this.#filmPresenters.get(data.id).forEach((presenter) => presenter.init(data));
        } else {
          this.#clearFilmsBoard();
          this.#renderFilmsBoard();
        }
        if(this.#filmDetailsPresenter && this.#filmDetailsPresenter.isOpened) {
          this.#openPopup(data);
        }
        break;
      case UpdateType.MINOR:
        this.#clearFilmsBoard();
        this.#renderFilmsBoard();
        if(this.#filmDetailsPresenter && this.#filmDetailsPresenter.isOpened) {
          this.#openPopup(data);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsBoard({resetRenderetFilmCount: true, resetSortType: true});
        this.#renderFilmsBoard();
        break;
      case updateType.NO_UPDATE:
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#filmLoading);
        this.#renderFilmsBoard();
        render(new FooterStatView(this.films.length), this.#footer);
        break;
    }
  };

  #onChangeSort = (sort) => {
    if(this.#currentSort === sort) {
      return;
    }

    this.#currentSort = sort;

    this.#clearFilmsBoard();
    this.#renderFilmsBoard();
  };

  #onShowMoreButtonClick = () => {
    this.films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film, this.#filmListContainer.element));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;
    if (this.#renderedFilmCount >= this.films.length) {
      remove(this.#showMoreButton);
    }
  };
}
