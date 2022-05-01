import {render} from './render';
import FilmsPresenter from './presenter/films-presenter';
import RateView from './view/rate-view';
import filmModel from './model/generate-film-model';

const header = document.querySelector('.header');
const mainContainer = document.querySelector('.main');

const filmPresenter = new FilmsPresenter();
const filmsModel = new filmModel();

render(new RateView(), header);

filmPresenter.init(mainContainer, filmsModel);
