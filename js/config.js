import apiFetch from "./api/client.js";

async function create(path, payload, callback) {

    const response = await apiFetch(path, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    if (!response.ok) {

        const { message } = await response.json();
        return callback(message, null);
    }

    const { message } = await response.json();

    return callback(null, message);
}

async function update(path, payload, type, callback) {

    const response = type === 'full'
        ? await apiFetch(path, { method: 'PUT', body: JSON.stringify(payload) })
        : await apiFetch(path, { method: 'PATCH', body: JSON.stringify(payload) })

    if (!response.ok) {
        const { message } = await response.json();
        return callback(message, null);
    }

    const { message } = await response.json();

    return callback(null, message);
}

async function remove(path, callback) {

    const response = await apiFetch(path, {
        method: 'DELETE'
    });

    if (!response.ok) {

        const { message } = await response.json();
        return callback(message, null);
    }

    const { message } = await response.json();

    return callback(null, message);
}

async function get(path, callback) {

    const response = await apiFetch(path, {
        method: 'GET',
    });

    if (!response.ok) {

        const { message } = await response.json();
        return callback(message, null);
    }

    const { data } = await response.json();

    return callback(null, data);
}

async function questionsGet(path, callback) {

    const response = await apiFetch(path, {
        method: 'GET',
    });

    if (!response.ok) {

        const { message } = await response.json();
        return callback(message, null);
    }

    const data = await response.json();

    return callback(null, data);
}
export { create, update, remove, get, questionsGet };