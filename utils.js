export const trace = val => {
  console.log('trace:', val);
  return val;
};

export const debug = val => {
  debugger;
  return val;
};

export const average = list => {
  const size = list.length;

  const sum = list.reduce((acc, val) => acc + val, 0);

  return sum / size;
};

export const rand = (min, max) => min + Math.random() * (max - min);
