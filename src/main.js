import FilmsListPresenter from './presenter/films-list-presenter';
import FilmModel from './model/film-model';

const header = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footer = document.querySelector('.footer');

const filmsModel = new FilmModel();
const filmListPresenter = new FilmsListPresenter(mainContainer, header, footer, filmsModel);
filmListPresenter.init();
