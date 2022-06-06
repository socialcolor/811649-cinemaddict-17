import FilmsListPresenter from './presenter/films-list-presenter';
import FilmModel from './model/film-model';
import {generateFilms, generateComments} from './mock/film';

const header = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footer = document.querySelector('.footer');

const films = generateFilms();
const comments = generateComments();

const filmsModel = new FilmModel(films, comments);
const filmListPresenter = new FilmsListPresenter(mainContainer, header, footer, filmsModel);
filmListPresenter.init();
