import {RenderPosition, render} from './render';
import FilmsPresenter from './presenter/films-presenter';
import RateView from './view/rate-view';
import FilmDetailsView from './view/film-details-view';
import { generateFilm } from './mock/film';

// eslint-disable-next-line no-console
console.log(generateFilm());

const header = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footer = document.querySelector('.footer');
const filmPresenter = new FilmsPresenter();

render(new RateView(), header);
render(new FilmDetailsView(), footer, RenderPosition.AFTEREND);
filmPresenter.init(mainContainer);
