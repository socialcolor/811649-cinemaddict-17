import FilmsListPresenter from './presenter/films-list-presenter';
import FilterPresenter from './presenter/filter-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import FilterModel from './model/filter-model';

const header = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footer = document.querySelector('.footer');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();
const filmListPresenter = new FilmsListPresenter(mainContainer, header, footer, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(mainContainer, filmsModel, filterModel);

filmListPresenter.init();
filterPresenter.init();
