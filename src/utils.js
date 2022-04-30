const getRandomInteger = (a = 0, b = 1, fraction = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1)).toFixed(fraction);
};

export {getRandomInteger};
