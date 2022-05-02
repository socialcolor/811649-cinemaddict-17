import {render, RenderPosition} from '../render';
import FilterView from '../view/filter-view';
import FilmSectionView from '../view/film-section-view';
import FilmListView from '../view/film-list-view';
import FilmListTitleView from '../view/film-list-title-view';
import FilmListContainerView from '../view/film-list-container-view';
import FilmItemView from '../view/film-item-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmMostView from '../view/film-most-view';
import FilmDetailsView from '../view/film-details-view';
import FilmCommentsView from '../view/film-details-comments.view';

const footer = document.querySelector('.footer');

export default class FilmsPresenter {
  init = (container, filmsModel) => {
    this.container = container;
    this.filmsModel = filmsModel;
    this.comments = filmsModel.getComments();
    this.films = filmsModel.getFilms();
    this.filmSection = new FilmSectionView();
    this.filmList = new FilmListView();
    this.filmListContainer = new FilmListContainerView();
    this.filmDetailsView = new FilmDetailsView(this.films[0]);
    this.commentsContainer = this.filmDetailsView.getElement().querySelector('.film-details__comments-list');

    render(new FilterView(), this.container);
    render(this.filmSection, this.container);
    render(this.filmList, this.filmSection.getElement());
    render(new FilmListTitleView(), this.filmList.getElement());
    render(this.filmListContainer, this.filmList.getElement());
    render(new ShowMoreButtonView(), this.filmList.getElement());
    render(new FilmMostView('Top rated'), this.filmSection.getElement());
    render(new FilmMostView('Most commented'), this.filmSection.getElement());
    render(this.filmDetailsView, footer, RenderPosition.AFTEREND);

    for(let i = 0; i < this.films[0].comments.length; i++) {
      const commentsId = this.comments[i];
      render(new FilmCommentsView(commentsId), this.commentsContainer);
    }

    for (const film of this.films) {
      render(new FilmItemView(film), this.filmListContainer.getElement());
    }
  };
}
