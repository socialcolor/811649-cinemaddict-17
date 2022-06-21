import { FiltersType  } from '../const';

const getCountFilmsInFilters = (filters) => ({
  [FiltersType.ALL]: filters.find((it) => it.type === FiltersType.ALL).count,
  [FiltersType.WATCHLIST]: filters.find((it) => it.type === FiltersType.WATCHLIST).count,
  [FiltersType.HISTORY]: filters.find((it) => it.type === FiltersType.HISTORY).count,
  [FiltersType.FAVORITES]: filters.find((it) => it.type === FiltersType.FAVORITES).count,
});

const filter = {
  [FiltersType.ALL]: (films) => films,
  [FiltersType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FiltersType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FiltersType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
};

export {filter, getCountFilmsInFilters};
