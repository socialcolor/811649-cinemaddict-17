import {render} from '../render';
import {remove} from '../remove';
import FilterView from '../view/filter-view';
import FilmSectionView from '../view/film-section-view';
import FilmListView from '../view/film-list-view';
import FilmListTitleView from '../view/film-list-title-view';
import FilmListContainerView from '../view/film-list-container-view';
import FilmItemView from '../view/film-item-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmMostView from '../view/film-most-view';
import FilmDetailsView from '../view/film-details-view';
import FilmDetailsCommentView from '../view/film-details-comments.view';
import FilmListEmptyView from '../view/film-list-empty-view';
import {FILM_COUNT_PER_STEP} from '../const';

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

  #handleShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  };

  #renderFilm = (film) => {
    const filmView = new FilmItemView(film);
    const filmDetailsView = new FilmDetailsView(film);

    const renderDetails = () => {
      render(filmDetailsView, document.body);

      const commentsContainer = filmDetailsView.element.querySelector('.film-details__comments-list');

      for(let i = 0; i < film.comments.length; i++) {
        const commentsId = this.#comments[i];
        render(new FilmDetailsCommentView(commentsId), commentsContainer);
      }
    };

    const onCloseClick = (evt) => {
      evt.preventDefault();
      closePopup();
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePopup();
      }
    };

    function closePopup () {
      document.body.classList.remove('hide-overflow');
      filmDetailsView.element.querySelector('.film-details__close-btn').removeEventListener('click', onCloseClick);
      remove(filmDetailsView);
      document.removeEventListener('keydown', onEscKeyDown);
    }

    const openPopup = (evt) => {
      evt.preventDefault();
      document.body.classList.add('hide-overflow');
      renderDetails();

      document.addEventListener('keydown', onEscKeyDown);
      filmDetailsView.element.querySelector('.film-details__close-btn').addEventListener('click', onCloseClick);
    };

    render(filmView, this.#filmListContainer.getElement());

    filmView.element.querySelector('.film-card__link').addEventListener('click', openPopup);
  };

  #renderFilmsBoard = () => {
    render(new FilterView(), this.#mainSection);
    render(this.#filmSection, this.#mainSection);
    render(this.#filmList, this.#filmSection.getElement());
    if(this.#films.length > 0) {
      render(new FilmListTitleView(), this.#filmList.getElement());
      render(this.#filmListContainer, this.#filmList.getElement());
      render(new FilmMostView('Top rated'), this.#filmSection.getElement());
      render(new FilmMostView('Most commented'), this.#filmSection.getElement());

      for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderFilm(this.#films[i]);
      }

      if(this.#films.length > FILM_COUNT_PER_STEP) {
        render(this.#showMoreButton, this.#filmList.getElement());

        this.#showMoreButton.element.addEventListener('click', this.#handleShowMoreButtonClick);
      }
    } else {
      render(new FilmListEmptyView('There are no movies in our database'), this.#filmList.getElement());
    }
  };


}
