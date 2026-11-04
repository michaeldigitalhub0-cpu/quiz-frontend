
const cache = new Map()

function saveData(key, data) {
    cache.set(key, data);
}

function getData(key) {
    return cache.get(key);
}

function deleteData(key) {
    return cache.delete(key);
}

export { saveData, getData, deleteData };