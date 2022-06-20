import dayjs from 'dayjs';

const formatDate = (data, format) => dayjs(data).format(format);

const formatTime = (time) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours}h ${minutes}m`;
};


export {formatDate, formatTime};
