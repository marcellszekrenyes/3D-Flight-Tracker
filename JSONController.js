async function fetchJSONData(url) {
    const response = await fetch(url);
    const jsonData = await response.json();

    return jsonData;
}

export {fetchJSONData}