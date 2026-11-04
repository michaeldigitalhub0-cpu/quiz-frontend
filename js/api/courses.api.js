
import { deleteData, getData, saveData } from "../cache.js";
import { create, get, remove, update } from "../config.js";
import createNotification from "../utils/alert.js";

async function createCourse(alertElement, payload) {

    await create('/course/new', payload, (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        deleteData('course:all');
        deleteData('course');

        return createNotification(alertElement, message, 'success');
    })
}

async function updateCourse(alertElement, payload, id) {

    await update(`/course/update?code=${id}`, payload, 'full', (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        deleteData('course:all');
        deleteData('course');
        return createNotification(alertElement, message, 'success');
    })
}


async function deleteCourse(alertElement, id) {

    await remove(`/course/delete?code=${id}`, (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        deleteData('course:all')
        deleteData('course');
        return createNotification(alertElement, message, 'success');
    })
}

async function getCourses(alertElement) {

    const cache = getData('course:all');

    if (cache) return cache;

    return await get('/course/all', (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        saveData('course:all', data);

        return data;
    })
}

async function getCourse(alertElement) {

    const cache = getData('course');

    if (cache) return cache;

    return await get('/course', (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        saveData('course', data);

        return data;
    })
}

async function getTotalQuizzes(alertElement, course_code) {

    return await get(`/course/quiz?course=${course_code}`, (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        return data[0] && data[0].total || 0;
    })
}

async function enrollStudent(payload, alertElement) {

    await create(`/course/enroll`, payload, (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');


        deleteData('enrollment:all');
        deleteData(`${payload.student_id}_course_enrollment:all`);
        deleteData(`course_${payload.course}_enrollment:all`);

        return createNotification(alertElement, message, 'success');
    })
}


async function getEnrollments() {

    const cache = getData('enrollment:all');

    if (cache) return cache;

    return await get(`/course/enrollment/all`, (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        return data
    })
}

async function getCourseEnrollments(course_code) {

    const cache = getData(`course_${course_code}_enrollment:all`);

    if (cache) return cache;

    return await get(`/course/enrollment?course=${course_code}`, (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        return data
    })
}

async function getStudentEnrollments(alertElement, student_id) {

    const cache = getData(`${student_id}_course_enrollment:all`);

    if (cache) return cache;

    return await get(`/course/student/enrollment?student=${student_id}`, (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        return data;
    })
}

async function deleteEnrollment(course_code, student_id, alertElement) {

    await remove(`/course/student/enrollment?course=${course_code}&student=${student_id}`, (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        deleteData('enrollment:all');
        deleteData(`${student_id}_course_enrollment:all`);
        deleteData(`course_${course_code}_enrollment:all`);

        return createNotification(alertElement, message, 'success');
    })
}

export { createCourse, updateCourse, getCourses, getCourse, getEnrollments, getTotalQuizzes, deleteCourse, enrollStudent, getCourseEnrollments, getStudentEnrollments, deleteEnrollment }