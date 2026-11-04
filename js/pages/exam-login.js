
import { quizLogin } from "../api/api.quiz_auth.js";
import { getPublishedStudent } from "../api/quizzes.api.js";
import createNotification from "../utils/alert.js";

(async function () {

    const selectElement = document.querySelector('#quizSelect');
    const data = await getPublishedStudent();

    selectElement.innerHTML = '';
    selectElement.innerHTML = '<option value="" selected disabled>Select a course to begin</option>';
    data.forEach(record => {

        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', record.id);
        optionElement.textContent = record.title;
        selectElement.appendChild(optionElement);
    })

    function searchCourse() {

        const query = document.querySelector('#courseSearch');

        query.oninput = () => {

            Array.from(selectElement.children).forEach(el => {

                if (el.value.includes(query.value)) el.selected = true;
            })
        }

    }

    searchCourse();
})();



function getPayload() {

    const studentID = document.querySelector('#studentID');
    const password = document.querySelector('#password');
    const quiz = document.querySelector('#quizSelect');

    return {
        student_id: studentID.value.trim().toUpperCase(),
        password: password.value,
        quiz_id: quiz.value
    }
}

document.querySelector('form').onsubmit = async (event) => {

    event.preventDefault();

    const data = getPayload();

    document.querySelector('button').disabled = true;

    if (!(/^(STU)\d{6}/.test(data.student_id)) || data.password.length < 8) {
        return createNotification('loginAlert', 'Invalid userID or Password', 'error');
    }


    document.querySelector('button').disabled = true;
    document.querySelector('button').style.cursor = 'wait';

    if (!(/^(STU)\d{6}$/.test(data.student_id)) || data.password.length < 8) {

        document.querySelector('button').disabled = false;
        document.querySelector('button').style.cursor = 'default';
        return createNotification('loginAlert', 'Invalid userID or Password', 'error');
    }

    try {

        await quizLogin(data, 'loginAlert');

        window.location.href = '../../pages/student/quiz.html';

    } catch (error) {

        throw error;
    } finally {

        document.querySelector('button').disabled = false;
        document.querySelector('button').style.cursor = 'default';
    }
}

