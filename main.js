import * as THREE from 'three';
import {initializeGlobe, onPointerMove} from './earthHover';
import {importAircraft, flightController, TWEEN} from './flightController';

//
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(7, 0, 7);
camera.up.set(0, 0, 1);
camera.layers.enable(1);

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 10, 5);
scene.add(directionalLight);

const loader = new THREE.ObjectLoader();

init();
animate();

//Load all data for the scene and set up the eventlistener for raycasting
async function init() {
  await initializeGlobe("./lowResGlobe.json", renderer, camera, scene, loader);
  await importAircraft("./public/wireframeAircraft.json", renderer, camera, scene, loader);
  const flightData = await flightController(scene);

  renderer.domElement.addEventListener( 'pointermove', (event) => {
    onPointerMove(event, camera, scene, renderer, flightData);
  });
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  renderer.render(scene, camera);
}