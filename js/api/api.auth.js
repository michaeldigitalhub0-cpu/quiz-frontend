
import { create, get } from "../config.js";
import createNotification from "../utils/alert.js";

async function login(payload, alertElement) {

    return await create('/auth/login', payload, (err, message) => {

        if (err) {
            createNotification(alertElement, err, 'error')
            throw err;
        };

        return createNotification(alertElement, message, 'success');
    })
}

async function logout(alertElement) {

    return await create('/auth/logout', {}, (err, message) => {

        if (err) throw err;

        return createNotification(alertElement, message, 'success');
    })
}

async function getUser() {

    const data = await get('/auth/user', (err, data) => {
        if (err) throw err;

        return data;
    })

    return data;
}

export { login, logout, getUser };