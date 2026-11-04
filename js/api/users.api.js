import { deleteData, getData, saveData } from "../cache.js";
import { create, get, remove, update } from "../config.js";
import createNotification from "../utils/alert.js";

async function createUser(alertElement, payload) {

    await create('/user/new', payload, (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        deleteData('admins:all');
        deleteData('students:all');
        deleteData('instructors:all');
        deleteData('hods:all');

        return createNotification(alertElement, message, 'success');
    })
}

async function getAdmins(alertElement) {
    const cache = getData('admins:all');

    if (cache) return cache;

    return await get('/user/all', (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        const admin = data.filter(record => record.user_role === 'admin');

        saveData('admins:all', admin);

        return admin;
    });
}

async function getInstructors(alertElement) {

    const cache = getData('instructors:all');

    if (cache) return cache;

    return await get('/user/all', (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        const instructors = data.filter(record => record.user_role === 'instructor');

        saveData('instructors:all', instructors);

        return instructors;
    });
}

async function getStudents(alertElement) {

    const cache = getData('students:all');

    if (cache) return cache;

    return await get('/user/all', (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        const students = data.filter(record => record.user_role === 'student');

        saveData('students:all', students);

        return students;
    });

}

async function getHod(alertElement) {

    const cache = getData('hod:all');

    if (cache) return cache;

    return await get('/user/all', (err, data) => {

        if (err) return createNotification(alertElement, err, 'error');

        const hods = data.filter(record => record.user_role === 'hod');

        saveData('hods:all', hods);

        return hods;
    });

}

async function updateUser(alertElement, id, payload) {

    await update(`/user/update?user=${id}`, payload, 'partial', (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        deleteData('admins:all');
        deleteData('students:all');
        deleteData('instructors:all');
        deleteData('hods:all');
        return createNotification(alertElement, message, 'success');
    })
}

async function updateUserAdmin(alertElement, id, payload) {

    await update(`/user/update?user=${id}`, payload, 'full', (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        deleteData('admins:all');
        deleteData('students:all');
        deleteData('instructors:all');
        deleteData('hods:all');
        return createNotification(alertElement, message, 'success');
    })
}

async function deleteUser(alertElement, id) {

    await remove(`/user/delete?user=${id}`, (err, message) => {

        if (err) return createNotification(alertElement, err, 'error');

        deleteData('admins:all');
        deleteData('students:all');
        deleteData('instructors:all');
        deleteData('hods:all');

        return createNotification(alertElement, message, 'success');
    })
}

export { createUser, updateUser, updateUserAdmin, getAdmins, getInstructors, getHod, getStudents, deleteUser };