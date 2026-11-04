import { deleteData, getData, saveData } from "../cache.js";
import { create, get, questionsGet, remove, update } from "../config.js";
import createNotification from "../utils/alert.js";

async function createQuiz(alertElement, payload) {

    await create('/quiz/new', payload, (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        deleteData('quiz:all')
        return createNotification(alertElement, message, 'success');
    })
}

async function updateQuiz(alertElement, quiz_id, payload) {

    await update(`/quiz/update?id=${quiz_id}`, payload, 'partial', (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        console.log(deleteData('quiz:all'));
        return createNotification(alertElement, message, 'success');
    })
}

async function publishQuiz(alertElement, quiz_id) {

    await update(`/quiz/publish?id=${quiz_id}`, {}, 'partial', (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        deleteData('quiz:all')
        return createNotification(alertElement, message, 'success');
    })
}

async function deleteQuiz(alertElement, quiz_id) {

    await remove(`/quiz?id=${quiz_id}`, (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        deleteData('quiz:all')
        return createNotification(alertElement, message, 'success');
    })
}

async function submitQuiz(alertElement, payload) {

    await create(`/quiz/submit`, payload, (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        return createNotification(alertElement, message, 'success');
    })
}

async function getQuizStudent() {

    const quiz = await get(`/quiz/student`, (err, data) => {

        if (err) throw err;

        return data
    });

    const questions = await questionsGet(`/question/student`, (err, data) => {

        if (err) throw err;
        return data;
    })

    return { ...quiz[0], questions };
}

async function getQuizInstructor(alertElement) {

    const cache = getData('quiz:all');
    if (cache?.length > 0) return cache;

    const quiz = await get(`/quiz`, (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        saveData('quiz:all', data);
        return data
    });

    return quiz;
}

async function getQuizAttemptsInstructor(alertElement, quiz_id) {

    const cache = getData(`quiz_${quiz_id}_attempts:all`);
    if (cache?.length > 0) return cache;

    const attempts = await get(`/quiz/attempt?quiz=${quiz_id}`, (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        saveData(`quiz_${quiz_id}_attempts:all`, data);
        return data
    });

    return attempts;
}

async function getQuizAttemptStudent(alertElement, quiz_id, student_id) {

    if (!quiz_id) {

        const attempts = await get(`/quiz/student/attempt`, (err, data) => {

            if (err) return createNotification(alertElement, err, 'error');

            return data
        });

        return attempts;
    }

    const attempts = await get(`/quiz/student/attempt?quiz=${quiz_id}`, (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        return data
    });

    return attempts || null;
}

async function getQuestions(alertElement, quiz_id) {

    const questions = await get(`/question/?quiz_id=${quiz_id}`, (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        return data;
    });

    return questions;
}

async function getPublishedQuiz(date) {

    if (date) {
        const published = await get(`/quiz/published?date=${date}`, (err, data) => {

            if (err) throw err;

            return data;
        })

        return published;
    }

    const published = await get(`/quiz/published`, (err, data) => {

        if (err) throw err;

        return data;
    })

    return published;
}

async function getPublishedStudent(alertElement) {

    const published = await get(`/quiz/published/student`, (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        return data;
    })

    return published;
}

async function updateQuestion(alertElement, quiz_id, question_id, payload) {

    await update(`/question/update?quiz=${quiz_id}&question=${question_id}`, payload, 'partial', (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        return createNotification(alertElement, message, 'success');
    })
}

async function deleteQuestion(alertElement, id) {

    await remove(`/question/?question=${id}`, (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        return createNotification(alertElement, message, 'success');
    })
}

export {
    createQuiz,
    updateQuiz,
    updateQuestion,
    deleteQuiz,
    deleteQuestion,
    getQuizInstructor,
    getPublishedStudent,
    getQuizAttemptsInstructor,
    getQuizAttemptStudent,
    getQuestions,
    getQuizStudent,
    publishQuiz,
    submitQuiz,
    getPublishedQuiz
};