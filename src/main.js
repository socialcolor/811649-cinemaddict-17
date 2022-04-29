import {RenderPosition, render} from './render';
import FilmsPresenter from './presenter/films-presenter';
import RateView from './view/rate-view';
import FilmDetailsView from './view/film-details-view';

const header = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footer = document.querySelector('.footer');
const filmPresenter = new FilmsPresenter();


render(new RateView(), header);
render(new FilmDetailsView(), footer, RenderPosition.AFTEREND);
filmPresenter.init(mainContainer);
