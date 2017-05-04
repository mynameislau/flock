import R from 'ramda';

export const distance = R.curry(([x1, y1], [x2, y2]) => {
  const a = x1 - x2;
  const b = y1 - y2;
  return Math.sqrt(a * a + b * b);
});

export const distanceVec2 = R.curry(([x1, y1], [x2, y2]) => {
  return [x2 - x1, y2 - y1];
});

export const averageVec2List = vectorsList => {
  const size = vectorsList.length;
  if (size === 0) {
    return [0, 0];
  }

  const sum = vectorsList.reduce(
    (acc, val) => [acc[0] + val[0], acc[1] + val[1]],
    [0, 0]
  );

  return [sum[0] / size, sum[1] / size];
};

export const vec2InterpolateTo = interpoplationValue => (
  [x1, y1],
  [x2, y2]
) => {
  return [
    x1 + (x2 - x1) * interpoplationValue,
    y1 + (y2 - y1) * interpoplationValue,
  ];
};

export const vec2Divide1 = R.curry((val, vec2) => vec2.map(R.flip(R.divide)(val)));

export const vec2Multiply1 = R.curry((val, vec2) => vec2.map(R.multiply(val)));

export const vec2Add1 = R.curry((val, vec2) => vec2.map(R.add(val)));
export const vec2Subtract1 = R.curry((val, vec2) => vec2.map(R.flip(R.subtract)(val)));

export const vec2MaxVec2 = R.curry(([x1, y1], [x2, y2]) => [
  Math.max(x1, x2),
  Math.max(y1, y2),
]);

export const vec2MinVec2 = R.curry(([x1, y1], [x2, y2]) => [
  Math.min(x1, x2),
  Math.min(y1, y2),
]);

export const vec2AddVec2 = R.curry(([x1, y1], [x2, y2]) => [x1 + x2, y1 + y2]);
export const vec2MultiplyVec2 = R.curry(([x1, y1], [x2, y2]) => [x1 * x2, y1 * y2]);

export const vec2Magnitude = ([x, y]) => Math.sqrt(x*x + y*y);
