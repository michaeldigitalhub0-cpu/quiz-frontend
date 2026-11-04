import { getUser } from "../../api/api.auth.js";
import { getStudentEnrollments } from "../../api/courses.api.js";
import { getPublishedStudent, getQuizAttemptStudent } from "../../api/quizzes.api.js";
import createNotification from "../../utils/alert.js";
import { convertTime } from "../../utils/format.js";

const student_id = await getStudentID();

async function getStudentID() {
    const student = await getUser();
    return student.user_id;
}

async function setDetails() {

    const enrolledPlaceholder = document.querySelector('#statCourses');
    const availableQuizzes = document.querySelector('#statAvailable');


    const [enrolled, available] = await Promise.all([
        await getStudentEnrollments('pageAlert', student_id),
        await getPublishedStudent(student_id, 'pageAlert')
    ])

    enrolledPlaceholder.textContent = enrolled.length;
    availableQuizzes.textContent = available.length;
}

async function renderRecords() {

    // ======================================= QUIZZES =============================
    const data = await getPublishedStudent(student_id, 'pageAlert');

    const table = document.querySelector('#availableBody');

    if (data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                  <div class="empty-state">No quizzes are open for you right now.</div>
                </td>
              </tr>
        `;
        return;
    }
    table.innerHTML = data.map(record => `
            <tr id=${record.id}>
                <td>${record.course}</td>
                <td>${record.title}</td>
                <td>${convertTime('min', record.duration)}</td>
                <td>${record.total_questions}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" id="startQuiz">Start Quiz</button>
                </td>
            </tr>    
    `).join('')
}

async function renderAttempts() {

    const attempt = await getQuizAttemptStudent('pageAlert', null, student_id);

    const record = document.querySelector('#resultsBody');
    if (attempt.length === 0) {

        record.innerHTML = `
             <tr>
                <td colspan="4">
                  <div class="empty-state">You have not completed any quiz yet.</div>
                </td>
              </tr>
        `;
        return;
    }
    record.innerHTML = attempt.map(data => `
            <tr>
                <td>${data.course}</td>
                <td>${data.title}</td>
                <td>${data.submitted_at ? 'True' : 'False'}</td>
                <td>${data.score}</td>
            </tr>    
    `).join('');

}

function setEventListeners() {

    document.body.addEventListener('click', async (e) => {

        const modalBox = document.querySelector('#startModal');

        if (e.target.id === 'startQuiz') {

            const quiz_id = e.target.parentElement.parentElement.id;

            const quizAttempt = await getQuizAttemptStudent('pageAlert', quiz_id, student_id);

            if (quizAttempt) return createNotification('pageAlert', 'You have attempted this quiz', 'error');

            modalBox.classList.remove('is-hidden');
        }

        if (e.target.id === 'startModalOk') {

            window.location.href = '../../pages/exam-login.html';
        }

        if (e.target.id === 'startModalCancel') {

            modalBox.classList.add('is-hidden');
        }
    })
}

async function init() {
    await setDetails();
    await renderRecords();
    await renderAttempts();
    setEventListeners();
}

init();