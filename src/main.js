import {render} from './framework/render';
import FilmsListPresenter from './presenter/films-list-presenter';
import RateView from './view/rate-view';
import FilmModel from './model/film-model';
import {generateFilms, generateComments} from './mock/film';

const header = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const films = generateFilms();
const comments = generateComments();

const filmsModel = new FilmModel(films, comments);
const filmListPresenter = new FilmsListPresenter(mainContainer, filmsModel);
render(new RateView(), header);
filmListPresenter.init();
