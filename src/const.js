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

const FILTERS_TYPE = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const EMPTY_TEXT = {
  ALL: 'There are no movies in our database',
  WATCHLIST: 'There are no watchlist movies now',
  HISTORY: 'There are no history movies now',
  FAVORITES: 'There are no favorite movies now',
};

const SORT_TYPE = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const DIRTCTORS = [
  'Guillermo del Toro',
  'David Cronenberg',
  'Woody Allen',
  'Tim Burton',
  'Akira Kurosawa',
  'Alfred Hitchcock',
  'Stanley Kubrick',
];

const GENRES = [
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
];

const COUNTRIES = [
  'USA',
  'England',
  'France',
  'Italy',
];

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const AUTHORS_COMMENT = [
  'Tim Macoveev',
  'John Doe',
  'Ilya O\'Reilly',
  'Igor Petrov',
];

const COMMENTS = [
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
];

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
};

export {
  FILM_LENGTH,
  COMMENTS_LENGTH,
  TOP_RATED_FILMS,
  MOST_COMMENTS_FILMS,
  DIRTCTORS,
  GENRES,
  COUNTRIES,
  POSTERS,
  AUTHORS_COMMENT,
  COMMENTS,
  EMOTIONS,
  FILM_COUNT_PER_STEP,
  FILTERS_TYPE,
  RATES,
  SORT_TYPE,
  EMPTY_TEXT,
  UserAction,
  UpdateType,
};
