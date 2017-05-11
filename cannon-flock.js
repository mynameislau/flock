import R from 'ramda';
import CANNON from 'cannon';
const { Vec3 } = CANNON;

import { trace, debug, average, rand } from './utils';

import {
  distance,
  distanceVec2,
  averageVec2List,
  vec2InterpolateTo,
  vec2Divide1,
  vec2Multiply1,
  vec2Add1,
  vec2Subtract1,
  vec2MaxVec2,
  vec2MinVec2,
  vec2AddVec2,
  vec2Magnitude,
  vecLimit,
  vecNegate,
  vecNormalize,
  randVec
} from './cannon-utils';

import { distance } from './cannon-utils';

// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const width = canvas.width;
// const height = canvas.height;

const flockRadius = 8;
const spawnRadius = 3;
const agentSize = 0.01;
const agentsNumber = 3;
const personalSpaceRadius = 0.5;
const cohesionWeight = 3;
const separationWeight = 5;
const alignmentWeight = 0.04;
const frequency = 1 / 60 * 1000;
const maxForce = 5;
const initVelocity = 0.1;
const friction = 0.95;
const baseMovementSpeed = 0.1;
const randomSteering = 1;

const createAgent = id => {
  const body = new CANNON.Body({
    mass: 2, // kg
    position: new CANNON.Vec3(
      rand(-spawnRadius, spawnRadius),
      rand(-spawnRadius, spawnRadius),
      rand(-spawnRadius, spawnRadius)
    ), // m
    shape: new CANNON.Sphere(agentSize),
    collisionResponse: false,
    linearDamping: 0.5
  });

  return {
    body,
    position: body.position,
    velocity: body.velocity,
    id
  };
};

// INIT

const agents = R.times(createAgent, agentsNumber);

// /// CANNON

const world = new CANNON.World();

world.gravity.set(0, 0, 0); // m/s²
agents.forEach(agent => world.addBody(agent.body));
const fixedTimeStep = 1.0 / 60.0; // seconds
const maxSubSteps = 3;

// Start the simulation loop
let lastTime;

// ///////////

const getAgents = () => agents;

// const infinitePos = (min, max, val) =>
//   val > max ? max : val < min ? min : val;

const step = delta => {
  applyForces();
  world.step(fixedTimeStep, delta, maxSubSteps);
};

const applyForces = () => {
  agents.forEach(agent => {
    agent.body.applyLocalForce(sumForces(agent), new Vec3(0, 0, 0));
  });
};

const neighbours = R.curry((radius, agentsList, agent) =>
  R.filter(
    curr =>
      curr.id !== agent.id && distance(curr.position, agent.position) < radius,
    agentsList
  )
);

const agentToPosition = agent => agent.position;

const agentToVelocity = agent => agent.velocity;

const agentsToCoordsList = agents => agents.map(agentToPosition);

const agentsToVelocityList = agents => agents.map(agentToVelocity);

const averageNeighboursPosition = R.compose(
  R.ifElse(
    R.isEmpty,
    () => null,
    R.compose(averageVec2List, agentsToCoordsList)
  ),
  agent => neighbours(flockRadius, getAgents(), agent)
);

const averageNeighboursVelocity = R.compose(
  averageVec2List,
  agentsToVelocityList,
  agent => neighbours(flockRadius, getAgents(), agent).concat([agent])
);

const cohesion = agent =>
  R.compose(
    R.ifElse(
      R.isNil,
      () => new Vec3(0, 0, 0),
      R.compose(
        vec => {
          const ratio = vec2Magnitude(vec) / flockRadius;
          const norm = vecNormalize(vec);
          const toReturn = vec2Multiply1(cohesionWeight * ratio, vec);
          return toReturn;
        },
        // trace,
        distanceVec2(agent.position)
      )
    ),
    averageNeighboursPosition
  )(agent);

const alignment = R.compose(
  vec2Multiply1(alignmentWeight),
  averageNeighboursVelocity
);

const separation = agent =>
  R.compose(
    R.ifElse(
      R.isEmpty,
      () => new Vec3(0, 0, 0),
      R.compose(
        vec => {
          const ratio = vec2Magnitude(vec) / personalSpaceRadius;
          const norm = vecNormalize(vec);
          const toReturn = vec2Multiply1(separationWeight * ratio, vec);
          console.log(toReturn);
          return toReturn;
        },
        //vecNormalize,
        vecNegate,
        averageVec2List,
        agentsToCoordsList
      )
    ),
    neighbours(personalSpaceRadius, getAgents())
  )(agent);

const applyFriction = vec2Multiply1(friction);

const baseAcceleration = ovec =>
  R.compose(
    // trace,
    vec2 => vec2AddVec2(randVec(randomSteering), vec2),
    // vec2Multiply1(1 + Math.random() * baseMovementSpeed)
    vec2Add1(baseMovementSpeed)
  )(ovec);

const sumForces = agent =>
  R.compose(
    //applyFriction,
    // trace,
    vecLimit(maxForce),
    // () => [-300, -300],
    // trace;
    //vec2AddVec2(alignment(agent)),
    //vec2AddVec2(separation(agent)),
    //vec2AddVec2(cohesion(agent)),
    //baseAcceleration,
    //R.prop('velocity')
    () => new Vec3(0.5, 0.5, 0.5)
  )(agent);

export default {
  step,
  agents
};
