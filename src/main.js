import {render} from './render';
import FilmsPresenter from './presenter/films-presenter';
import RateView from './view/rate-view';
import FilmModel from './model/film-model';
import {generateFilms, generateComments} from './mock/film';

const header = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const films = generateFilms();
const comments = generateComments();

const filmsModel = new FilmModel(films, comments);
const filmPresenter = new FilmsPresenter(mainContainer, filmsModel);
render(new RateView(), header);

filmPresenter.init();
