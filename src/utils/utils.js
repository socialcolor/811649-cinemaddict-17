import dayjs from 'dayjs';

const formatDate = (data, format) => dayjs(data).format(format);

const formatTime = (time) => {
  const ONE_HOUR_IN_MINUTES = 60;
  const hours = Math.floor(time / ONE_HOUR_IN_MINUTES);
  const minutes = time % ONE_HOUR_IN_MINUTES;
  return `${hours}h ${minutes}m`;
};


export {formatDate, formatTime};
