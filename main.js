// import THREE from 'THREE';

import flockSim from './cannon-flock';

const agentsLength = flockSim.agents.length;

// store.dispatch({ type: 'tick' });

if (WEBVR.isAvailable() === false) {
  // document.body.appendChild(WEBVR.getMessage());
}
//
var clock = new THREE.Clock();
var container;
var camera, scene, raycaster, renderer;
var effect, controls;
var room;
var isMouseDown = false;
var INTERSECTED;
var crosshair;

init();
animate();
function init () {
  container = document.createElement('div');
  document.body.appendChild(container);
  var info = document.createElement('div');

  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  container.appendChild(info);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 5;
  scene.add(camera);
  crosshair = new THREE.Mesh(
    new THREE.RingGeometry(0.02, 0.04, 32),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.5,
      transparent: true
    })
  );
  crosshair.position.z = -2;
  camera.add(crosshair);
  room = new THREE.Mesh(
    new THREE.BoxGeometry(6, 6, 6, 8, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x404040, wireframe: true })
  );
  scene.add(room);
  scene.add(new THREE.HemisphereLight(0x606060, 0x404040));
  var light = new THREE.DirectionalLight(0xffffff);

  light.position.set(1, 1, 1).normalize();
  scene.add(light);
  var geometry = new THREE.ConeGeometry(0.05, 0.10);

  flockSim.agents.forEach(agent => {
    var object = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
    );

    object.position.x = agent.body.position.x;
    object.position.y = agent.body.position.y;
    object.position.z = agent.body.position.z;
    object.userData.body = agent.body;

    room.add(object);
  });
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x505050);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.sortObjects = false;
  container.appendChild(renderer.domElement);
  // controls = new THREE.VRControls(camera);
  effect = new THREE.VREffect(renderer);
  WEBVR.getVRDisplay(display => {
    document.body.appendChild(WEBVR.getButton(display, renderer.domElement));
  });
  renderer.domElement.addEventListener('mousedown', onMouseDown, false);
  renderer.domElement.addEventListener('mouseup', onMouseUp, false);
  renderer.domElement.addEventListener('touchstart', onMouseDown, false);
  renderer.domElement.addEventListener('touchend', onMouseUp, false);
  //
  window.addEventListener('resize', onWindowResize, false);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
}
function onMouseDown () {
  isMouseDown = true;
}
function onMouseUp () {
  isMouseDown = false;
}
function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  effect.setSize(window.innerWidth, window.innerHeight);
}
//
function animate () {
  effect.requestAnimationFrame(animate);
  render();
}

var lastTime;

(function simloop (time) {
  requestAnimationFrame(simloop);
  if (lastTime !== undefined) {
    var dt = (time - lastTime) / 1000;

    flockSim.step(dt);
  }
  lastTime = time;

  render();
}());

function render () {
  var delta = clock.getDelta() * 60;

  // if (isMouseDown === true) {
  //   var cube = room.children[0];
  //
  //   room.remove(cube);
  //   cube.position.set(0, 0, -0.75);
  //   cube.position.applyQuaternion(camera.quaternion);
  //   cube.userData.velocity.x = (Math.random() - 0.5) * 0.02 * delta;
  //   cube.userData.velocity.y = (Math.random() - 0.5) * 0.02 * delta;
  //   cube.userData.velocity.z = (Math.random() * 0.01 - 0.05) * delta;
  //   cube.userData.velocity.applyQuaternion(camera.quaternion);
  //   room.add(cube);
  // }

  // // Keep cubes inside room
  for (var i = 0; i < room.children.length; i++) {
    var object = room.children[i];

    object.position.x = object.userData.body.position.x;
    object.position.y = object.userData.body.position.y;
    object.position.z = object.userData.body.position.z;
    // object.quaternion.x = object.userData.body.quaternion.x;
    // object.quaternion.y = object.userData.body.quaternion.y;
    // object.quaternion.z = object.userData.body.quaternion.z;
    // object.quaternion.w = object.userData.body.quaternion.w;

    const rotaZ = Math.atan2(
      object.userData.body.velocity.x,
      object.userData.body.velocity.z
    );
    const rotaX = Math.atan2(
      object.userData.body.velocity.z,
      object.userData.body.velocity.y
    );
    const rotaY = Math.atan2(
      object.userData.body.velocity.z,
      object.userData.body.velocity.y
    );

    // object.rotation.x = rotaY;
    // object.rotation.y = rotaX;
    object.rotation.z = rotaZ + Math.PI / 2;
    object.rotation.x = rotaX -Math.PI / 2;
    object.rotation.y =  Math.PI;

    // cube.userData.velocity.multiplyScalar(1 - 0.001 * delta);
    // cube.position.add(cube.userData.velocity);
    // if (cube.position.x < -3 || cube.position.x > 3) {
    //   cube.position.x = THREE.Math.clamp(cube.position.x, -3, 3);
    //   cube.userData.velocity.x = -cube.userData.velocity.x;
    // }
    // if (cube.position.y < -3 || cube.position.y > 3) {
    //   cube.position.y = THREE.Math.clamp(cube.position.y, -3, 3);
    //   cube.userData.velocity.y = -cube.userData.velocity.y;
    // }
    // if (cube.position.z < -3 || cube.position.z > 3) {
    //   cube.position.z = THREE.Math.clamp(cube.position.z, -3, 3);
    //   cube.userData.velocity.z = -cube.userData.velocity.z;
    // }
    // cube.rotation.x += cube.userData.velocity.x * 2 * delta;
    // cube.rotation.y += cube.userData.velocity.y * 2 * delta;
    // cube.rotation.z += cube.userData.velocity.z * 2 * delta;
  }
  controls.update();

  renderer.render(scene, camera);
  // effect.render(scene, camera);
}
