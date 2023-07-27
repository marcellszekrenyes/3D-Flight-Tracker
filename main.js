import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 2, 7);
camera.up.set(0, 0, 1);
camera.layers.enable(1);
let renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// //GRID*AXES HELPER
// const size = 10;
// const divisions = 10;

// const gridHelper = new THREE.GridHelper( size, divisions );
// scene.add( gridHelper );

// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );





const loader = new THREE.ObjectLoader();

function importer(file) {
  loader.load(
    // resource URL
    file,

    // onLoad callback
    // Here the loaded data is assumed to be an object
    function ( obj ) {
      // Add the loaded object to the scene
      scene.add( obj );
      setObjectLayers();
    },

    // onProgress callback
    function ( xhr ) {
      console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },

    // onError callback
    function ( err ) {
      console.error( 'An error happened' );
    }
  );
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function setObjectLayers(){
  for(let i = 0; i <= scene.children[1].children.length-1; i++){
    console.log(scene.children[1].children[i]);
    const nextGroup = scene.children[1].children[i];
    for(let j = 0;  j <= nextGroup.children.length-1; j++){
       if(nextGroup.children[j].material.isLineBasicMaterial == true){
         console.log(nextGroup.children[j]);
         nextGroup.children[j].layers.set(1);
       }
    }
  }
}

importer("./lowResGlobeGrey.json");
animate();

// //INNEN COPY



const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false; //disables camera pan
let sphere = new THREE.Mesh(new THREE.SphereGeometry( 3.795, 256, 128 ), new THREE.MeshBasicMaterial({
  color: new THREE.Color("rgb(29,162,216)"),
//   wireframe: true
}));
sphere.name = 'sphere';
sphere.material.color.multiplyScalar(0.5);
scene.add(sphere);
let nullPoint = new THREE.Mesh(new THREE.SphereGeometry(.125, 4, 2), new THREE.MeshBasicMaterial({
  color: "red"
}));
nullPoint.position.set(0, 0, 2);
sphere.add(nullPoint);

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let intersects;
let pointOfIntersection = new THREE.Vector3();
let localPoint = new THREE.Vector3();
let spherical = new THREE.Spherical();
let lat, lon;

window.addEventListener("mousedown", sphereClick, false);
renderer.domElement.addEventListener( 'pointermove', onPointerMove );

function sphereClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObject(sphere);
  console.log(intersects);
  if (intersects.length == 0) return;
  pointOfIntersection = intersects[0].point;
  console.log('Point:');
  console.log(pointOfIntersection);
  sphere.worldToLocal(localPoint.copy(pointOfIntersection));
  createPoint(localPoint);

  console.log('latLon:');
  console.log(cartesianToSpherical(pointOfIntersection));
}

function onPointerMove( event ) {
	if ( event.isPrimary === false ) return;
  const rect = renderer.domElement.getBoundingClientRect();

  mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
  mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
	// mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	// mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  console.log('mouse.x:');
  console.log(mouse.x);
  console.log('mouse.y:');
  console.log(mouse.y);

	checkIntersection();
}

let lastHoveredCountry = "";

// function removeHoverEffect() {
//   if(lastHoveredCountry == ""){
//           lastHoveredCountry = intersects[0].object;
//         } else if(lastHoveredCountry.uuid != intersects[0].uuid) {
//           for(let i = 1; i <= lastHoveredCountry.parent.children.length-1; i++){
//             lastHoveredCountry.parent.children[i].material = new THREE.MeshBasicMaterial({color: 0x444444});
//           }
//           lastHoveredCountry = intersects[0].object;
//         }
// }

function checkIntersection() {
  // scene.add(new THREE.ArrowHelper( raycaster2.ray.direction, raycaster2.ray.origin, 100, 0xffffff ));
  raycaster.setFromCamera( mouse, camera );
  const intersects = raycaster.intersectObject( scene, true );
  console.log('intersects');
  console.log(intersects);
  if ( intersects.length > 0 && intersects[0].object.name != 'sphere') {
    if(lastHoveredCountry == ""){
      lastHoveredCountry = intersects[0].object;
    } else if(lastHoveredCountry.uuid != intersects[0].uuid) {
      for(let i = 1; i <= lastHoveredCountry.parent.children.length-1; i++){
        if(lastHoveredCountry.parent.children[i].material.isMeshBasicMaterial == true){
        lastHoveredCountry.parent.children[i].material = new THREE.MeshBasicMaterial({color: 'rgb(41, 41, 43)'});
        }
      }
      lastHoveredCountry = intersects[0].object;
    }

      let selectedObject = intersects[0].object;

      addSelectedObject( selectedObject );

    
      for(let i = 1; i <= selectedObject.parent.children.length-1; i++){
        if(lastHoveredCountry.parent.children[i].material.isMeshBasicMaterial == true){
        selectedObject.parent.children[i].material = new THREE.MeshBasicMaterial({color: 0xffffff});
        selectedObject.parent.children[i].material.color.set( 0xffffff );
        }
      }
  } else if(intersects.length == 0 && lastHoveredCountry != ""){
    console.log('intersects[0]');
    console.log(intersects[0]);
    console.log('lastHoveredCountry.parent.children');
    console.log(lastHoveredCountry.parent.children);
    for(let i = 1; i <= lastHoveredCountry.parent.children.length-1; i++){
      if(lastHoveredCountry.parent.children[i].material.isMeshBasicMaterial == true){
        lastHoveredCountry.parent.children[i].material = new THREE.MeshBasicMaterial({color: 'rgb(41, 41, 43)'});
      }
    }
    lastHoveredCountry = "";
  }
}

function addSelectedObject( object ) {

  let selectedObjects = [];
  selectedObjects.push( object );

}

function createPoint(position) {
  let point = new THREE.Mesh(new THREE.SphereGeometry(0.0625, 16, 12), new THREE.MeshBasicMaterial({
    color: 0x777777 + Math.random() * 0x777777
  }));
  point.position.copy(position);
  sphere.add(point);
  let color = point.material.color.getHexString();
  spherical.setFromVector3(position);
  lat = radians_to_degrees(spherical.phi);
  lon = radians_to_degrees(spherical.theta);
//   pointList.innerHTML += "<span style='color:#" + color + "'>lat: " + lat + ";  lon: " + lon + "</span><br>";
  console.log('lat: ' + lat);
  console.log('lon: ' + lon);
}

let clock = new THREE.Clock();
let delta = 0;
render();

function render() {
  delta = clock.getDelta();
  requestAnimationFrame(render);
//   sphere.rotation.y += degrees_to_radians(-4) * delta;
  renderer.render(scene, camera);
}

function degrees_to_radians(degrees){
	let pi = Math.PI;
	return degrees * (pi/180);
}

function radians_to_degrees(radians){
  let pi = Math.PI;
  return radians * (180/pi);
}


// function sphericalToCartesian(phi, theta) {
//   const xyz = [];
//   const radius = 4;

//   xyz[0] = radius * Math.cos(theta * Math.PI / 180) * Math.cos(phi * Math.PI / 180)
//   xyz[1] = radius * Math.cos(theta * Math.PI / 180) * Math.sin(phi * Math.PI / 180)
//   xyz[2] = radius *Math.sin(theta * Math.PI / 180)

//   // x = R * cos(lat) * cos(lon)

//   // y = R * cos(lat) * sin(lon)

//   // z = R *sin(lat)

//   return xyz;
// }

function cartesianToSpherical(clickedPoint) {
  const radius = 3.795;

  const lat = Math.asin(clickedPoint.getComponent(2) / radius) * 180 / Math.PI;
  // const long = Math.asin(clickedPoint.getComponent(1) / (radius * Math.acos(lat * Math.PI / 180))) * 180 / Math.PI;
  const long = Math.atan2(clickedPoint.getComponent(1), clickedPoint.getComponent(0)) * 180 / Math.PI;

  const latLong = [lat, long];
  // x = R * cos(lat) * cos(lon)

  // y = R * cos(lat) * sin(lon)

  // z = R *sin(lat)

  return latLong;
}
