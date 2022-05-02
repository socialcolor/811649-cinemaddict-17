import {render} from './render';
import FilmsPresenter from './presenter/films-presenter';
import RateView from './view/rate-view';
import filmModel from './model/generate-film-model';
import {generateFilms, generateComments} from './mock/film';

const header = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const films = generateFilms();
const comments = generateComments();

const filmPresenter = new FilmsPresenter();
const filmsModel = new filmModel(films, comments);

render(new RateView(), header);

filmPresenter.init(mainContainer, filmsModel);
