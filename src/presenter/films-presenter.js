import {render} from '../render';
import FilterView from '../view/filter-view';
import FilmSectionView from '../view/film-section-view';
import FilmListView from '../view/film-list-view';
import FilmListTitleView from '../view/film-list-title-view';
import FilmListContainerView from '../view/film-list-container-view';
import FilmItemView from '../view/film-item-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmTopRateView from '../view/film-top-rate-view';
import FilmMostCommentView from '../view/film-most-comment-view';

const FILMS_NUMBER = 5;

export default class FilmsPresenter {
  init = (container) => {
    this.container = container;
    this.filmSection = new FilmSectionView();
    this.filmList = new FilmListView();
    this.filmListContainer = new FilmListContainerView();

    render(new FilterView(), this.container);
    render(this.filmSection, this.container);
    render(this.filmList, this.filmSection.getElement());
    render(new FilmListTitleView(), this.filmList.getElement());
    render(this.filmListContainer, this.filmList.getElement());
    render(new ShowMoreButtonView(), this.filmList.getElement());
    render(new FilmTopRateView(), this.filmSection.getElement());
    render(new FilmMostCommentView(), this.filmSection.getElement());

    for (let i = 0; i < FILMS_NUMBER; i++) {
      render(new FilmItemView(), this.filmListContainer.getElement());
    }
  };
}
