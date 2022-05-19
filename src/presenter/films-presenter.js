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
import {FILM_COUNT_PER_STEP, TOP_RATED_FILMS, MOST_COMMENTS_FILMS} from '../const';

export default class FilmsPresenter {
  #mainSection = null;
  #filmModel = null;

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

  #onShowMoreButtonClick = () => {
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        new FilmPresenter(film, this.#comments, this.#filmListContainer.element);
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
      new FilmPresenter(topRateFimls[i], this.#comments, topRated.element.querySelector('.films-list__container'));
    }
    for(let i = 0; i < MOST_COMMENTS_FILMS; i++) {
      new FilmPresenter(mostCommentsFilms[i], this.#comments, mostComment.element.querySelector('.films-list__container'));
    }
  };

  #renderFilmsBoard = () => {
    const watchlist = this.#films.filter((film) => film.filmInfo.userDetails.watchlist);
    const favorite = this.#films.filter((film) => film.filmInfo.userDetails.favorite);
    render(new FilterView(watchlist, favorite), this.#mainSection);
    render(this.#filmSection, this.#mainSection);
    render(this.#filmList, this.#filmSection.element);


    if(this.#films.length > 0) {
      render(new FilmListTitleView(), this.#filmList.element);
      render(this.#filmListContainer, this.#filmList.element);


      for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
        new FilmPresenter(this.#films[i], this.#comments, this.#filmListContainer.element);
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
}
