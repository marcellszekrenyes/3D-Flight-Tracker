import * as THREE from 'three';
import {initializeGlobe, onPointerMove} from './earthHover';
import {importAircraft, flightController, TWEEN} from './flightController';
import { hideAircrafts } from './flightController';

//
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(7, 0, 7);
camera.up.set(0, 0, 1);
camera.layers.enable(1);

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
const canvas = document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 10, 5);
scene.add(directionalLight);

//Objectloader of three.js
const loader = new THREE.ObjectLoader();

//loader screen
const loadingScreen = document.getElementById("loaderContainer");
const options = document.getElementById('options');

init();
animate();

//Load all data for the scene and set up the eventlistener for raycasting
async function init() {
  await initializeGlobe("./lowResGlobe.json", renderer, camera, scene, loader);
  await importAircraft("./wireframeAircraft.json", renderer, camera, scene, loader);
  const flightData = await flightController(scene);
  hideCanvas();
  showCanvas();
  renderer.domElement.addEventListener( 'pointermove', (event) => {
    if(document.getElementById('hoverCheckbox').checked){
      onPointerMove(event, camera, scene, renderer, flightData);
    }
  });

  document.getElementById('options').addEventListener('click', () => {
    if (document.getElementById('hoverCheckbox').checked == false && document.getElementById('routesCheckbox').checked == false) {
      for(let i = 4; i <= scene.children.length - 1; i++) {
        if(scene.children[i].material.isMeshBasicMaterial == true){
          scene.children[i].material.opacity = 1;
          scene.children[i].material.transparent = false;
          scene.children[i].material.wireframe = false;
          if(scene.children[i].layers != 1) {
            scene.children[i].layers.set(1);
          }
        }
      }
    } else if(document.getElementById('hoverCheckbox').checked == false && document.getElementById('routesCheckbox').checked == true) {
      for(let i = 4; i <= scene.children.length - 1; i++) {
        scene.children[i].material.opacity = 1;
        scene.children[i].material.transparent = false;
        scene.children[i].material.wireframe = false;
        scene.children[i].layers.set(1);
      }
    }
    
    
    if (document.getElementById('hoverCheckbox').checked == true) {
        for(let i = 4; i <= scene.children.length - 1; i++) {
          scene.children[i].material.opacity = 0;
          scene.children[i].material.transparent = true;
          scene.children[i].material.wireframe = false;
          scene.children[i].layers.set(2);
        }
    }
  });
  
  //nem mukodik a ket radio button, vonalak nem kapcsolnak ki + visszakapcs utan a hover szar
}

function hideCanvas() {
  console.log(canvas);
  canvas.visible = false;
}

function showCanvas() {
  loadingScreen.classList.add('fadeEffect');
  setTimeout(() => {
    loadingScreen.remove();
    canvas.classList.add('fadeinEffect');
    setTimeout();
  }, 500);
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  renderer.render(scene, camera);
}