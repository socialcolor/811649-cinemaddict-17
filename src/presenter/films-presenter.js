import {render, remove} from '../framework/render';
// import {remove} from '../remove';
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

  #onShowMoreButtonClick = () => {
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

    const onCloseClick = () => {
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

    const openPopup = () => {
      document.body.classList.add('hide-overflow');
      renderDetails();

      document.addEventListener('keydown', onEscKeyDown);
      filmDetailsView.seCloseButtonHandler(onCloseClick);
    };

    render(filmView, this.#filmListContainer.element);
    filmView.setFilmLinkHandler(openPopup);
  };

  #renderFilmsBoard = () => {
    render(new FilterView(), this.#mainSection);
    render(this.#filmSection, this.#mainSection);
    render(this.#filmList, this.#filmSection.element);
    if(this.#films.length > 0) {
      render(new FilmListTitleView(), this.#filmList.element);
      render(this.#filmListContainer, this.#filmList.element);
      render(new FilmMostView('Top rated'), this.#filmSection.element);
      render(new FilmMostView('Most commented'), this.#filmSection.element);

      for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderFilm(this.#films[i]);
      }

      if(this.#films.length > FILM_COUNT_PER_STEP) {
        render(this.#showMoreButton, this.#filmList.element);
        this.#showMoreButton.setShowMoreButtonHandler(this.#onShowMoreButtonClick);
      }
    } else {
      render(new FilmListEmptyView('There are no movies in our database'), this.#filmList.element);
    }
  };
}
