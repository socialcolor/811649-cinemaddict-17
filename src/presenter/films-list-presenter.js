import {render, remove} from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
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
import {FILM_COUNT_PER_STEP, TOP_RATED_FILMS, MOST_COMMENTS_FILMS, SortType, FiltersType, EmtyText, UpdateType, UserAction} from '../const';
import dayjs from 'dayjs';
import { filter } from '../utils/filter';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class FilmsListPresenter {
  #mainSection = null;
  #header = null;
  #footer = null;
  #filmsModel = null;
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
  #isLoading = true;

  #currentFilter = FiltersType.ALL;
  #currentSort = SortType.DEFAULT;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor (container, header, footer, filmsModel, filterModel) {
    this.#mainSection = container;
    this.#header = header;
    this.#footer = footer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);
  }

  get films() {
    const films = this.#filmsModel.films;
    const FilterType = this.#filterModel.filter;
    const filtredFilms = filter[FilterType](films);

    switch (this.#currentSort) {
      case SortType.RATING:
        return filtredFilms.sort((a, b) => b.filmInfo.rate - a.filmInfo.rate);
      case SortType.DATE:
        return filtredFilms.sort((a, b) => dayjs(b.filmInfo.release.date) - dayjs(a.filmInfo.release.date));
      case SortType.DEFAULT:
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
    const rate = filter[FiltersType.HISTORY](this.#filmsModel.films).length;
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
    const text = EmtyText[this.#filterModel.filter.toUpperCase()];
    this.#filmListEmpty = new FilmListEmptyView(text);
    render(this.#filmListEmpty, this.#filmList.element);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButton.setShowMoreButtonHandler(this.#onShowMoreButtonClick);
    render(this.#showMoreButton, this.#filmList.element);
  };

  #renderExtraBlock = () => {
    const topRateFilms = [...this.#filmsModel.films].sort((a, b) => b.filmInfo.rate - a.filmInfo.rate).filter((film) => film.filmInfo.rate);
    const mostCommentsFilms = [...this.#filmsModel.films].sort((a, b) => b.comments.length - a.comments.length).filter((film) => film.comments.length);

    if(topRateFilms.length) {
      this.#topRated = new FilmMostView('Top rated');
      render(this.#topRated, this.#filmSection.element);
      for(let i = 0; i < Math.min(TOP_RATED_FILMS, topRateFilms.length); i++) {
        this.#renderFilm(topRateFilms[i], this.#topRated.element.querySelector('.films-list__container'));
      }
    }

    if(mostCommentsFilms.length) {
      this.#mostComment = new FilmMostView('Most commented');
      render(this.#mostComment, this.#filmSection.element);
      for(let i = 0; i < Math.min(MOST_COMMENTS_FILMS, mostCommentsFilms.length); i++) {
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
      if(filmCount > FILM_COUNT_PER_STEP && this.#renderedFilmCount < filmCount) {
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
      this.#currentSort = SortType.DEFAULT;
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

    if(this.#filmDetailsPresenter && this.#filmDetailsPresenter.isOpened && this.#filmDetailsPresenter.filmId === film.id) {
      scrollPosition = this.#filmDetailsPresenter.getScrollPosition();
      this.#filmDetailsPresenter.init(await film, await this.#filmsModel.getComments(film.id));
      this.#filmDetailsPresenter.setScrollPosition(scrollPosition);
      return;
    }

    this.#closePopup();
    this.#filmDetailsPresenter = new FilmDetailsPresenter(this.#onViewAction);
    this.#filmDetailsPresenter.init(await film, await this.#filmsModel.getComments(film.id));
  };

  #onViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    const scrollPosition = this.#filmDetailsPresenter?.isOpened ? this.#filmDetailsPresenter.getScrollPosition() : null;
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch {
          if(this.#filmDetailsPresenter.isOpened) {
            this.#filmDetailsPresenter.setAborting(scrollPosition);
          }
          this.#filmPresenters.get(update.id).forEach((presenter) => presenter.setAborting());
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmDetailsPresenter.setDeleting(update.commentId, scrollPosition);
        try{
          await this.#filmsModel.deleteComment(updateType, update);
        } catch {
          this.#filmDetailsPresenter.setAborting(scrollPosition);
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#filmDetailsPresenter.setSaving(scrollPosition);
        try{
          await this.#filmsModel.addComment(updateType, update);
        } catch {
          this.#filmDetailsPresenter.setAborting(scrollPosition);
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #onModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if(this.#filterModel.filter === FiltersType.ALL) {
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
