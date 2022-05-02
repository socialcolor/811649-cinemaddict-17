import {getRandomInteger} from '../utils';
import {DIRTCTORS, GENRES, COUNTRIES, POSTERS, AUTHORS_COMMENT, COMMENTS, EMOTIONS, FILM_LENGTH, COMMENTS_LENGTH} from '../const';

const generateTitle = () => {
  const name = [
    'Made for each other',
    'Popeye meets sinbad',
    'Sagebrush trail',
    'Santa claus-conquers the martians',
    'The dance of life',
    'The great flamarion',
    'The man with the golden arm',
  ];

  const randomIndex = getRandomInteger(0, name.length -1);

  return name[randomIndex];
};

const generatePoster = () => {
  const randomIndex = getRandomInteger(0, POSTERS.length -1);

  return POSTERS[randomIndex];
};

const generateDescription = () => {
  const sentences = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus'.split('. ').map((i)=>i.replace(/\.*$/,'.'));
  const sentenceLength = getRandomInteger(1, 5);
  let description = '';

  for(let i = 0; i <= sentenceLength; i++) {
    description += `${sentences[getRandomInteger(0, sentences.length - 1)]} `;
  }

  return description.replace(/ $/, '');
};

const addCommentsInFilm = () => {
  const comments = [];

  for(let i = 0; i < getRandomInteger(0, COMMENTS_LENGTH); i++) {
    comments.push(getRandomInteger(0, COMMENTS_LENGTH));
  }
  return comments;
};

const generateFilms = () => {
  const filmsArray = [];
  for (let i = 0; i < FILM_LENGTH; i++) {
    filmsArray.push(
      {
        id: i,
        comments: addCommentsInFilm(),
        filmInfo: {
          title: generateTitle(),
          alternativeTitle: generateTitle(),
          rate: getRandomInteger(0, 10, 1),
          poster: generatePoster(),
          ageRating: getRandomInteger(0, 18),
          director: DIRTCTORS[getRandomInteger(0, DIRTCTORS.length - 1)],
          writers: DIRTCTORS[getRandomInteger(0, DIRTCTORS.length - 1)],
          actors: DIRTCTORS[getRandomInteger(0, DIRTCTORS.length - 1)],
          release: {
            date: '2022-05-02T16:12:32.554Z',
            releaseCountry: COUNTRIES[getRandomInteger(0, COUNTRIES.length - 1)]
          },
          runtime: getRandomInteger(70, 150),
          genre: GENRES[getRandomInteger(1, 3)],
          description: generateDescription(),
          userDetails: {
            watchlist: Boolean(getRandomInteger(0, 1)),
            alreadyWatched: Boolean(getRandomInteger(0, 1)),
            watchingDate: '2022-05-02T16:12:32.554Z',
            favorite: Boolean(getRandomInteger(0, 1)),
          }
        }
      }
    );
  }
  return filmsArray;
};

const generateComments = () => {
  const commentsArray = [];
  for(let i = 0; i < COMMENTS_LENGTH; i++) {
    commentsArray.push(
      {
        id: getRandomInteger(0, FILM_LENGTH - 1),
        author: AUTHORS_COMMENT[getRandomInteger(0, AUTHORS_COMMENT.length - 1)],
        comment:COMMENTS[getRandomInteger(0, COMMENTS.length - 1)],
        date: '2022-05-02T16:12:32.554Z',
        emotion: EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)],
      }
    );
  }
  return commentsArray;
};

export {generateFilms, generateComments, addCommentsInFilm};
