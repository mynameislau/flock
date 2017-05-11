import R from 'ramda';
import { rand } from './utils';
import { Vec3 } from 'cannon';

export const randVec = (min, max) =>
  new Vec3(rand(min, max), rand(min, max), rand(min, max));

export const distance = R.curry((vecA, vecB) => vecA.distanceTo(vecB));

export const distanceVec2 = R.curry((vecA, vecB) => {
  return vecB.vsub(vecA);
});

export const averageVec2List = vectorsList => {
  const size = vectorsList.length;

  if (size === 0) {
    return null;
  }

  const sum = vectorsList.reduce(
    (acc, val) => acc.vadd(val),
    new Vec3(0, 0, 0)
  );

  return sum.scale(1 / size);
};

export const vec2InterpolateTo = R.curry((value, vecA, vecB) =>
  vecA.vadd(vecB.vsub(vecA).scale(value))
);

export const vec2Divide1 = R.curry((val, vec) => vec.scale(1 / val));

export const vec2Multiply1 = R.curry((val, vec) => vec.scale(val));

export const vec2Add1 = R.curry((val, vec) =>
  vec.vadd(new Vec3(val, val, val))
);

export const vec2Subtract1 = R.curry((val, vec) =>
  vec.vsub(new Vec3(val, val, val))
);

export const vec2MaxVec2 = R.curry(
  (vecA, vecB) =>
    new Vec3(
      Math.max(vecA.x, vecB.x),
      Math.max(vecA.y, vecB.y),
      Math.max(vecA.z, vecB.Z)
    )
);

export const vec2MinVec2 = R.curry(
  (vecA, vecB) =>
    new Vec3(
      Math.min(vecA.x, vecB.x),
      Math.min(vecA.y, vecB.y),
      Math.min(vecA.z, vecB.Z)
    )
);

export const vec2AddVec2 = R.curry((vecA, vecB) => vecA.vadd(vecB));

export const vec2MultiplyVec2 = R.curry(
  (vecA, vecB) => new Vec3(vecA.x * vecB.x, vecA.y * vecB.y, vecA.z * vecB.Z)
);

export const vec2DivideVec2 = R.curry(
  (vecA, vecB) => new Vec3(vecA.x / vecB.x, vecA.y / vecB.y, vecA.z / vecB.Z)
);

export const vecNormalize = vec => {
  const newVec = vec.clone();
  newVec.normalize();
  return newVec;
}

export const vecNegate = vec => vec.negate();

export const vec2Magnitude = vec => vec.length();

export const vecLimit = R.curry((max, vec) => {
  const vecMagnitude = vec.length();

  return vec.scale(Math.min(1, max / vecMagnitude));
});
