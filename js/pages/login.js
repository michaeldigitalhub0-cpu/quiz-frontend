import { login } from "../api/api.auth.js";
import createNotification from "../utils/alert.js";

function getPayload() {

    const userID = document.querySelector('#userID');
    const password = document.querySelector('#password');
    const userRole = document.querySelector('#userRole');

    return {
        user_id: userID.value.trim().toUpperCase(),
        user_password: password.value,
        user_role: userRole.value
    }
}

document.querySelector('form').onsubmit = async (event) => {

    event.preventDefault();

    const data = getPayload();

    document.querySelector('button').disabled = true;
    document.querySelector('button').style.cursor = 'wait';

    if (!(/^(DIR|INS|ADM|STU)\d{6}$/.test(data.user_id)) || data.user_password.length < 8) {

        document.querySelector('button').disabled = false;
        document.querySelector('button').style.cursor = 'default';
        return createNotification('loginAlert', 'Invalid userID or Password', 'error');
    }

    try {

        await login(data, 'loginAlert');

        switch (data.user_role) {

            case 'admin': window.location.href = '../../pages/admin/dashboard.html';
                break;
            case 'hod': window.location.href = '../../pages/hod/courses.html';
                break;
            case 'instructor': window.location.href = '../../pages/instructor/dashboard.html';
                break;
            case 'student': window.location.href = '../../pages/student/dashboard.html';
                break;
        }

    } catch (error) {

        throw error;
    } finally {

        document.querySelector('button').disabled = false;
        document.querySelector('button').style.cursor = 'default';
    }
}

document.querySelector('button').disabled = false;
document.querySelector('button').style.cursor = 'default';