const FILM_COUNT_PER_STEP = 5;
const FILM_LENGTH = 30;
const COMMENTS_LENGTH = 10000;
const TOP_RATED_FILMS = 2;
const MOST_COMMENTS_FILMS = 2;

const RATES = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

const FiltersType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const EmtyText = {
  ALL: 'There are no movies in our database',
  WATCHLIST: 'There are no watchlist movies now',
  HISTORY: 'There are no history movies now',
  FAVORITES: 'There are no favorite movies now',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const UserAction = {
  OPEN_POPUP: 'OPEN_POPUP',
  UPDATE_FILM: 'UPDATE_FILM',
  UPDATE_WATCHLIST: 'UPDATE_WATCHLIST',
  UPDATE_HISTORY: 'UPDATE_HISTORY',
  UPDATE_FAVORITE: 'UPDATE_FAVORITE',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  NO_UPDATE: 'NO_UPDATE',
  INIT: 'INIT',
};

export {
  FILM_LENGTH,
  COMMENTS_LENGTH,
  TOP_RATED_FILMS,
  MOST_COMMENTS_FILMS,
  EMOTIONS,
  FILM_COUNT_PER_STEP,
  FiltersType,
  RATES,
  SortType,
  EmtyText,
  UserAction,
  UpdateType,
};
