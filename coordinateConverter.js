import * as THREE from 'three';

function sphericalToCartesian(phi, theta) {
    const radius = 3.795;

    const position = new THREE.Vector3(radius * Math.cos(theta * Math.PI / 180) * Math.cos(phi * Math.PI / 180),
                radius * Math.cos(theta * Math.PI / 180) * Math.sin(phi * Math.PI / 180),
                radius *Math.sin(theta * Math.PI / 180))

    return position;
}

function convertCoordinates(testObject){
    const cartesianTestObject = [];
    cartesianTestObject.push(0, 0, 0);
    for(let i = 0; i <= testObject.length-1; i++){
        const longLatVertex = testObject[i];
        const cartesianVertex = sphericalToCartesian(longLatVertex[0], longLatVertex[1]);
        cartesianTestObject.push(cartesianVertex[0], cartesianVertex[1], cartesianVertex[2]);
    }
    console.log(cartesianTestObject);
    const vertices = new Float32Array(cartesianTestObject);
    console.log(vertices);
    return vertices;
}

function generateIndices(vertices) {
    const indices = [];
    const indicesLength = (vertices.length-3)/3;

    for(let i = 0; i <= indicesLength; i++){
        indices.push(0, i + 1, i + 2);
    }

    indices.push(0, 1, indicesLength + 1);
    console.log(indices);
    return indices;
}

function convertAirplaneLocation(phi, theta, radius) {
    const position = new THREE.Vector3(radius * Math.cos(theta * Math.PI / 180) * Math.cos(phi * Math.PI / 180),
                radius * Math.cos(theta * Math.PI / 180) * Math.sin(phi * Math.PI / 180),
                radius *Math.sin(theta * Math.PI / 180));

    return position;
}

export {convertCoordinates, generateIndices, sphericalToCartesian, convertAirplaneLocation}