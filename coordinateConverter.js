

function sphericalToCartesian(phi, theta) {
    const xyz = [];
    const radius = 4;
    

    xyz[0] = radius * Math.cos(theta * Math.PI / 180) * Math.cos(phi * Math.PI / 180)
    xyz[1] = radius * Math.cos(theta * Math.PI / 180) * Math.sin(phi * Math.PI / 180)
    xyz[2] = radius *Math.sin(theta * Math.PI / 180)

    // x = R * cos(lat) * cos(lon)

    // y = R * cos(lat) * sin(lon)

    // z = R *sin(lat)

    return xyz;
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

export {convertCoordinates, generateIndices}