import FilmsListPresenter from './presenter/films-list-presenter';
import FilterPresenter from './presenter/filter-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilmsApiService from './film-api-service';

const AUTHORIZATION = 'Basic testFilmAut12';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const header = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footer = document.querySelector('.footer');
const filmApiService = new FilmsApiService(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel(filmApiService);
const filterModel = new FilterModel();
const filmListPresenter = new FilmsListPresenter(mainContainer, header, footer, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainContainer, filmsModel, filterModel);

filterPresenter.init();
filmListPresenter.init();
filmsModel.init();
