import {getRandomInteger} from '../utils';
import dayjs from 'dayjs';
import {DIRTCTORS, GENRES, COUNTRIES, AUTHORS_COMMENT, COMMENTS, EMOTIONS} from '../const';

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
  const poster = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];

  const randomIndex = getRandomInteger(0, poster.length -1);

  return poster[randomIndex];
};

const generateDuration = () => {
  const hours = getRandomInteger(1, 2);
  const minutes = getRandomInteger(0, 60);
  return `${hours}h ${minutes}m`;
};

const generateDescription = () => {
  const sentences = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus'.split('. ').map((i)=>i.replace(/\.*$/,'.'));
  const sentenceLength = getRandomInteger(1, 5);
  let description = '';

  for(let i = 0; i <= sentenceLength; i++) {
    description += `${sentences[getRandomInteger(0, sentences.length - 1)]} `;
  }

  return description.length <= 140 ? description.replace(/ $/, '') : description.replace(/ $/, '..');
};

const generateComment = (id) => (
  {
    id: id,
    author: getRandomInteger(0, AUTHORS_COMMENT.length - 1),
    comment: getRandomInteger(0, COMMENTS.length - 1),
    date: dayjs().subtract(getRandomInteger(1, 100, 'day').format('YYYY-MM-DDTHH:mm:ssZ[Z]')),
    emotion: getRandomInteger(0, EMOTIONS.length - 1),
  });

const generateFilm = (id, comments) => (
  {
    id: id,
    comments: comments,
    filmInfo: {
      title: generateTitle(),
      rate: getRandomInteger(0, 10, 1),
      poster: generatePoster(),
      ageRating: getRandomInteger(0, 18),
      director: DIRTCTORS[getRandomInteger(0, DIRTCTORS.length - 1)],
      writers: DIRTCTORS[getRandomInteger(0, DIRTCTORS.length - 1)],
      actors: DIRTCTORS[getRandomInteger(0, DIRTCTORS.length - 1)],
      release: {
        date: dayjs().subtract(getRandomInteger(1, 11000), 'day').format('DD MMM YYYY'),
        releaseCountry: COUNTRIES[getRandomInteger(0, COUNTRIES.length - 1)]
      },
      runtime: generateDuration(),
      genre: GENRES.slice(0,  getRandomInteger(1, GENRES.length)),
      description: generateDescription(),
      comments: getRandomInteger(0, 10),
      userDetails: {
        watchlist: Boolean(getRandomInteger(0, 1)),
        alreadyWatched: Boolean(getRandomInteger(0, 1)),
        watchingDate: dayjs().subtract(getRandomInteger(1, 100), 'day').format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
        favorite: Boolean(getRandomInteger(0, 1)),
      }
    }
  }
);

export {generateFilm, generateComment};
