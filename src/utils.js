import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1, fraction = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  if(fraction === 0) {
    return Math.floor(lower + Math.random() * (upper - lower + 1));
  }
  return (lower + Math.random() * (upper - lower + 1)).toFixed(fraction);
};

const formatDate = (data, minDay, maxDay, format) => dayjs(data).subtract(getRandomInteger(minDay, maxDay), 'day').format(format);

const formatTime = (time) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours}h ${minutes}m`;
};

export {getRandomInteger, formatDate, formatTime};
