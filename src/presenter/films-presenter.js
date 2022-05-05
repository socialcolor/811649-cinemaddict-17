import {render} from '../render';
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

export default class FilmsPresenter {
  #mainSection = null;
  #filmModel = null;

  #filmSection = new FilmSectionView();
  #filmList = new FilmListView();
  #filmListContainer = new FilmListContainerView();
  #films = [];
  #comments = [];

  constructor (container, filmsModel) {
    this.#mainSection = container;
    this.#filmModel = filmsModel;
  }

  init = () => {
    this.#films = [...this.#filmModel.films];
    this.#comments = [...this.#filmModel.comments];

    this.#renderFilmsBoard();

  };

  #renderfilm = (film) => {
    const filmView = new FilmItemView(film);
    const filmDetailsView = new FilmDetailsView(film);

    const renderDetails = () => {
      document.body.appendChild(filmDetailsView.getElement());

      const commentsContainer = filmDetailsView.element.querySelector('.film-details__comments-list');

      for(let i = 0; i < film.comments.length; i++) {
        const commentsId = this.#comments[i];
        render(new FilmDetailsCommentView(commentsId), commentsContainer);
      }
    };

    const closePopup = (evt) => {
      evt.preventDefault();
      document.body.classList.remove('hide-overflow');
      filmDetailsView.element.querySelector('.film-details__close-btn').removeEventListener('click', closePopup);
      document.body.removeChild(filmDetailsView.getElement());
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        document.body.classList.remove('hide-overflow');
        document.removeEventListener('keydown', onEscKeyDown);
        document.body.removeChild(filmDetailsView.getElement());
      }
    };

    const openPopup = (evt) => {
      evt.preventDefault();
      document.body.classList.add('hide-overflow');
      renderDetails();

      document.addEventListener('keydown', onEscKeyDown);
      filmDetailsView.element.querySelector('.film-details__close-btn').addEventListener('click', closePopup);
    };

    render(filmView, this.#filmListContainer.getElement());

    filmView.element.querySelector('.film-card__link').addEventListener('click', openPopup);
  };

  #renderFilmsBoard = () => {
    render(new FilterView(), this.#mainSection);
    render(this.#filmSection, this.#mainSection);
    render(this.#filmList, this.#filmSection.getElement());
    render(new FilmListTitleView(), this.#filmList.getElement());
    render(this.#filmListContainer, this.#filmList.getElement());
    render(new ShowMoreButtonView(), this.#filmList.getElement());
    render(new FilmMostView('Top rated'), this.#filmSection.getElement());
    render(new FilmMostView('Most commented'), this.#filmSection.getElement());

    for (const film of this.#films) {
      this.#renderfilm(film);
    }
  };


}
