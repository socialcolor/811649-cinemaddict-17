import {render} from './render';
import FilmsPresenter from './presenter/films-presenter';
import RateViww from './view/rate-view';

const header = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const filmPresenter = new FilmsPresenter();

render(new RateViww(), header);
filmPresenter.init(mainContainer);
