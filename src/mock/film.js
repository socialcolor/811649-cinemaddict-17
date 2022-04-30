import {getRandomInteger} from '../utils';

const generateName = () => {
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

const generateYear = () => getRandomInteger(1950, 2022);

const generateRate = () => getRandomInteger(0, 10);

const generateDuration = () => {
  const hours = getRandomInteger(1, 2);
  const minutes = getRandomInteger(0, 60);
  return `${hours}h ${minutes}m`;
};

const generateGenre = () => {
  const genre = [
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Thriller',
  ];

  const randomIndex = getRandomInteger(0, genre.length -1);

  return genre[randomIndex];
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

export const generateFilm = () => (
  {
    poster: generatePoster(),
    name: generateName(),
    rate: generateRate(),
    year: generateYear(),
    duration:generateDuration(),
    genre: generateGenre(),
    description: generateDescription(),
    comments: getRandomInteger(0, 10),
  }
);

