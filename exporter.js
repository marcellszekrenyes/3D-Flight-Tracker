
function exportSceneToJSON(scene){
    let result = scene.toJSON();
    console.log('scene got converted to JSON');
    let output = JSON.stringify(result);
    console.log('result got stringified');
    download(output, 'scene.json', 'application/json');
    console.log('File should have been downloaded');
}

function download(content, fileName, contentType) {
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

export {exportSceneToJSON};