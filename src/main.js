import {render} from './render';
import FilmsPresenter from './presenter/films-presenter';
import RateView from './view/rate-view';
// import FilmDetailsView from './view/film-details-view';
import filmModel from './model/generate-film-model';

const header = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
// const footer = document.querySelector('.footer');

const filmPresenter = new FilmsPresenter();
const filmsModel = new filmModel();

render(new RateView(), header);
// render(new FilmDetailsView(), footer, RenderPosition.AFTEREND);

filmPresenter.init(mainContainer, filmsModel);
