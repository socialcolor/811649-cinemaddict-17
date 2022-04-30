import {render} from '../render';
import FilterView from '../view/filter-view';
import FilmSectionView from '../view/film-section-view';
import FilmListView from '../view/film-list-view';
import FilmListTitleView from '../view/film-list-title-view';
import FilmListContainerView from '../view/film-list-container-view';
import FilmItemView from '../view/film-item-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import FilmMostView from '../view/film-most-view';

export default class FilmsPresenter {
  init = (container, filmsModel) => {
    this.container = container;
    this.filmsModel = filmsModel;
    this.films = [...filmsModel.getFilms()];

    this.filmSection = new FilmSectionView();
    this.filmList = new FilmListView();
    this.filmListContainer = new FilmListContainerView();

    render(new FilterView(), this.container);
    render(this.filmSection, this.container);
    render(this.filmList, this.filmSection.getElement());
    render(new FilmListTitleView(), this.filmList.getElement());
    render(this.filmListContainer, this.filmList.getElement());
    render(new ShowMoreButtonView(), this.filmList.getElement());
    render(new FilmMostView('Top rated'), this.filmSection.getElement());
    render(new FilmMostView('Most commented'), this.filmSection.getElement());

    for (let i = 0; i < this.films.length; i++) {
      render(new FilmItemView(this.films[i]), this.filmListContainer.getElement());
    }
  };
}
