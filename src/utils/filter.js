import { FILTERS_TYPE } from '../const';

const getCountFilmsInFilters = (filters) => ({
  [FILTERS_TYPE.ALL]: filters.find((it) => it.type === FILTERS_TYPE.ALL).count,
  [FILTERS_TYPE.WATCHLIST]: filters.find((it) => it.type === FILTERS_TYPE.WATCHLIST).count,
  [FILTERS_TYPE.HISTORY]: filters.find((it) => it.type === FILTERS_TYPE.HISTORY).count,
  [FILTERS_TYPE.FAVORITES]: filters.find((it) => it.type === FILTERS_TYPE.FAVORITES).count,
});

const filter = {
  [FILTERS_TYPE.ALL]: (films) => films,
  [FILTERS_TYPE.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FILTERS_TYPE.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FILTERS_TYPE.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
};

export {filter, getCountFilmsInFilters};
