
import { create, get } from "../config.js";
import createNotification from "../utils/alert.js";

async function quizLogin(payload, alertElement) {

    return await create('/auth/quiz/login', payload, (err, message) => {

        if (err) {
            createNotification(alertElement, err, 'error')
            throw err;
        };

        return createNotification(alertElement, message, 'success');
    })
}

async function quizLogout(alertElement) {

    return await create('/auth/quiz/logout', {}, (err, message) => {

        if (err) throw err;

        return createNotification(alertElement, message, 'success');
    })
}

async function getStudent() {

    const data = await get('/auth/quiz/user', (err, data) => {
        if (err) throw err;

        return data;
    })

    return data;
}

export { quizLogin, quizLogout, getStudent };