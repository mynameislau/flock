import R from 'ramda';

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
  vec2Magnitude
} from './vec2-utils';

import { trace, debug, average, rand } from './utils';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const flockRadius = 100;
const agentsNumber = 40;
const personalSpaceRadius = 10;
const spawnRadius = 100;
const cohesionWeight = 0.00005;
const alignmentWeight = 0.04;
const frequency = 1 / 60 * 1000;
const maxForce = 1.2;
const initVelocity = 0.1;
const friction = 0.98;
const baseMovementSpeed = 0.05;
const randomSteering = 0;
const separationWeight = 0.05;

const createAgent = id => ({
  // orientation: rand(-Math.PI, Math.PI),
  id,
  velocity: [
    rand(-initVelocity, initVelocity),
    rand(-initVelocity, initVelocity)
  ],
  coords: [
    width / 2 + rand(-spawnRadius, spawnRadius),
    height / 2 + rand(-spawnRadius, spawnRadius)
  ]
});

let state = {
  agents: R.times(createAgent, agentsNumber)
};

const getAgents = () => state.agents;

// const infinitePos = (min, max, val) =>
//   val > max ? max : val < min ? min : val;

const agentsReducer = (prevState, action) => {
  switch (action.type) {

  case 'applyForces':
    return R.assoc(
        'agents',
        prevState.agents.map(
          R.compose(
            agent =>
              R.assoc(
                'coords',
                vec2AddVec2(agent.coords, agent.velocity),
                agent
              ),
            agent => R.assoc('velocity', sumForces(agent), agent)
          )
        ),
        prevState
      );
  default:
    return prevState;

  }
};

const neighbours = R.curry((radius, agentsList, agent) =>
  R.filter(
    curr =>
      curr.id !== agent.id && distance(curr.coords, agent.coords) < radius,
    agentsList
  )
);

const agentToCoords = agent => agent.coords;

const agentToVelocity = agent => agent.velocity;

const agentsToCoordsList = agents => agents.map(agentToCoords);

const agentsToVelocityList = agents => agents.map(agentToVelocity);

const averageNeighboursPosition = R.compose(
  averageVec2List,
  agentsToCoordsList,
  agent => neighbours(flockRadius, getAgents(), agent).concat([agent])
);

const averageNeighboursVelocity = R.compose(
  averageVec2List,
  agentsToVelocityList,
  agent => neighbours(flockRadius, getAgents(), agent).concat([agent])
);

const cohesion = agent =>
  R.compose(
    vec2Multiply1(cohesionWeight),
    // trace,
    distanceVec2(agent.coords),
    averageNeighboursPosition
  )(agent);

const alignment = R.compose(
  vec2Multiply1(alignmentWeight),
  averageNeighboursVelocity
);

const separation = agent =>
  R.compose(
    vec2Multiply1(separationWeight),
    // vec2MaxVec2([-2, -2]),
    // vec2MinVec2([2, 2]),
    vec2Limit(1),
    R.reduce(vec2AddVec2, [0, 0]),
    R.map(([x, y]) => [1 / x, 1 / y]),
    //R.map(R.flip(vec2Divide1)(1)), // 1/30 -> 0.00001
    R.map(vec2Add1(0.00001)),
    // debug,
    R.map(distanceVec2(agent.coords)),
    // debug,
    // trace,
    agentsToCoordsList,
    neighbours(personalSpaceRadius, getAgents())
  )(agent);

const applyFriction = vec2Multiply1(friction);

const vec2Limit = force => R.compose(
  vec2 => {
    //console.log('entree', vec2);
    const absMagnitude = Math.abs(vec2Magnitude(vec2));
    const ratio = Math.max(1, absMagnitude / force)
    //console.log(absMagnitude, maxForce, ratio);
    const result = vec2Divide1(ratio, vec2);
    //console.log('result', result);
    return result;
  }
  //vec2 => vec2Subtract1(Math.max(0, vec2[0] + vec2[1] - 3) / 2, vec2),
  //vec2 => vec2Subtract1(Math.min(0, (vec2[0] + vec2[1]) / 2, vec2)
);

const baseAcceleration = ovec =>
  R.compose(
    // trace,
    vec2 => vec2AddVec2([
      rand(-randomSteering, randomSteering),
      rand(-randomSteering, randomSteering)
    ], vec2),
    //vec2Multiply1(1 + Math.random() * baseMovementSpeed)
    vec2Multiply1(1 + baseMovementSpeed)
  )(ovec);

const sumForces = agent =>
  R.compose(
    applyFriction,
    //trace,
    vec2Limit(maxForce),
    // () => [-300, -300],
    //trace,
    vec2AddVec2(alignment(agent)),
    vec2AddVec2(cohesion(agent)),
    vec2AddVec2(separation(agent)),
    baseAcceleration,
    R.prop('velocity')
  )(agent);

window.setInterval(() => {
  // state = incrementAgents();
  state = agentsReducer(state, {
    type: 'applyForces'
  });
}, frequency);

const render = () => {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  state.agents.forEach(({ coords, velocity }) => {
    const [x, y] = coords;
    const [vx, vy] = velocity;
    const angle = Math.atan2(vy, vx);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.lineTo(x, y);
    ctx.lineTo(
      x + Math.cos(angle - Math.PI / 2) * 3,
      y + Math.sin(angle - Math.PI / 2) * 3
    );
    ctx.lineTo(x + cos * 10, y + sin * 10);
    ctx.lineTo(
      x + Math.cos(angle + Math.PI / 2) * 3,
      y + Math.sin(angle + Math.PI / 2) * 3
    );
    // ctx.fill();
    ctx.stroke();
  });

  requestAnimationFrame(render);
};

requestAnimationFrame(render);
