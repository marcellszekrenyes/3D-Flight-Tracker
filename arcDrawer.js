import * as THREE from 'three';

//Calculates the control points for ac route curves
function getControlPoints(startPoint, endPoint, clockWise){
const controlPoints = [];
const origo = new THREE.Vector3();

let ab = new THREE.Vector3();
let cb = new THREE.Vector3();
let normal = new THREE.Vector3();

ab.subVectors(startPoint, endPoint); //vector that points from endPoint to startPoint
cb.subVectors(origo, endPoint); //vector that points from endPoint to the origo of the sphere (0, 0, 0) in my case
cb.cross(ab); //perpendicular vector to ab and cb
normal.copy(cb).normalize();

let angle = startPoint.angleTo(endPoint); // get the angle between vectors
if (clockWise) angle = angle - Math.PI * 2;  // if clockWise is true, then we'll go the longest path

controlPoints.push(startPoint.clone().applyAxisAngle(normal, angle * 0.25))// this is the key operation
controlPoints.push(startPoint.clone().applyAxisAngle(normal, angle * 0.75))

// console.log('-------------------------------');
// console.log('controlPoints:');
// console.log(controlPoints);
// console.log('-------------------------------');

if(angle <= 30 * Math.PI / 180){
    controlPoints[0].multiplyScalar(1.1);
    controlPoints[1].multiplyScalar(1.1);
}else if(angle <= 60 * Math.PI / 180){
    controlPoints[0].multiplyScalar(1.25);
    controlPoints[1].multiplyScalar(1.25);
}else if (angle <= 120 * Math.PI / 180){
    controlPoints[0].multiplyScalar(1.5);
    controlPoints[1].multiplyScalar(1.5);
}else if (angle <= 180 * Math.PI / 180){
    controlPoints[0].multiplyScalar(1.75);
    controlPoints[1].multiplyScalar(1.75);
}


return controlPoints;
}

//Creates the curve
function drawCurve(startPoint, endPoint) {
    const numPoints = 50;
    const controlPoints = getControlPoints(startPoint, endPoint, false);
    const curve = new THREE.CubicBezierCurve3(startPoint, controlPoints[0], controlPoints[1], endPoint);
    const points = curve.getPoints( numPoints );
    const curveGeometry = new THREE.BufferGeometry().setFromPoints( points );
    const curveMaterial = new THREE.LineBasicMaterial( { color: 'rgb(114, 7, 230)' } );
    const curveObject = new THREE.Line( curveGeometry, curveMaterial );

    return curveObject;
}

export {drawCurve, getControlPoints};