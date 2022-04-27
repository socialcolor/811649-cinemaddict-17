import {render} from '../render';
import FilterView from '../view/filter-view';
import FilmSectionView from '../view/film-section-view';
import FilmListView from '../view/film-list-view';
import FilmItemView from '../view/film-item-view';
import ShowMoreButtonView from '../view/show-more-button-view';

export default class FilmsPresenter {
  init = (container) => {
    this.container = container;
    this.filmSection = new FilmSectionView();
    this.filmList = new FilmListView();
    this.filmListContainer = this.filmList.getElement().querySelector('.films-list__container');

    render(new FilterView(), this.container);
    render(this.filmSection, this.container);
    render(this.filmList, this.filmSection.getElement());
    render(new ShowMoreButtonView(), this.filmList.getElement());

    for (let i = 0; i < 5; i++) {
      render(new FilmItemView(), this.filmListContainer);
    }
  };
}
