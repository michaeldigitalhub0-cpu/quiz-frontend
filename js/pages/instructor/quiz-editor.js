import { getCourse } from "../../api/courses.api.js";
import { createQuiz, deleteQuestion, deleteQuiz, getQuestions, getQuizInstructor, publishQuiz, updateQuestion, updateQuiz } from "../../api/quizzes.api.js";
import createNotification from "../../utils/alert.js";
import { questionUpdateDialogue, quizUpdateDialogue } from "../../utils/dom.js";
import { convertTime } from "../../utils/format.js";

const questions = JSON.parse(localStorage.getItem('questions') || '[]');

(async function () {

    const data = await getCourse('pageAlert');

    if (data.length === 0) {
        document.querySelectorAll('input').forEach(el => el.disabled = true);
        document.querySelector('textarea').disabled = true;
        document.querySelector('#correctOption').disabled = true;
    }

    document.querySelector('#quizCourse').disabled = true;
    document.querySelector('#quizCourse').innerHTML
        = `<option value="${data[0]?.code || 'Un-assigned'}" selected>${data[0]?.code || 'Un-assigned'}</option>`;
})()

async function renderQuiz() {

    const data = await getQuizInstructor('pageAlert');
    const table = document.querySelector('#quizBody');

    if (data.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4">
                  <div class="empty-state">No quiz added yet.</div>
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = '';
    data.forEach(record => {

        const row = document.createElement('tr');

        const status = document.createElement('td');
        const quizTitle = document.createElement('td');
        const quizDuration = document.createElement('td');
        const actions = document.createElement('td');

        const radioElement = document.createElement('input');

        row.setAttribute('id', record.id);
        radioElement.setAttribute('type', 'radio');
        radioElement.setAttribute('name', 'quiz');
        radioElement.onchange = () => radioElement.checked ? renderQuestion(record.id) : null;
        quizTitle.textContent = record.title;
        quizDuration.textContent = convertTime('min', record.duration);
        actions.innerHTML = `
            <button class="btn btn-sm btn-secondary" id="publishQuiz">Publish</button>
            <button class="btn btn-sm btn-secondary" id="updateQuiz">Update</button>
            <button class="btn btn-sm btn-secondary" id="deleteQuiz">Delete</button>
        `;

        status.appendChild(radioElement)
        row.appendChild(status);
        row.appendChild(quizTitle);
        row.appendChild(quizDuration);
        row.appendChild(actions);

        table.appendChild(row);
    })
}

async function renderQuestion(quiz_id) {

    const data = await getQuestions('pageAlert', quiz_id);

    const table = document.querySelector('#questionBody');

    let count = 1;
    table.innerHTML = data.map(record =>
        `
        <tr id="${record.id}_${quiz_id}">
            <td>${count++}</td>
            <td>${record.text}</td>
            <td>
                <ol>
                    <li>${record.first_option}</li>
                    <li>${record.second_option}</li>
                    <li>${record.third_option}</li>
                    <li>${record.fourth_option}</li>
                </ol>
            </td>
            <td>${record.correct_option}</td> 
            <td>${record.awarded_point}</td>
            <td>
                <button class="btn btn-sm btn-secondary" id="updateQuestion">Update</button>
                <button class="btn btn-sm btn-secondary" id="deleteQuestion">Delete</button>
            </td>  
        </tr>
    `).join('');
}

function getQuizData() {

    const courseCode = document.querySelector('#quizCourse');
    const title = document.querySelector('#quizTitle');
    const duration = document.querySelector('#quizDuration');

    return {
        course_code: courseCode.value,
        title: title.value,
        duration: convertTime('ms', duration.value)
    }
}

function getQuizUpdate() {

    const title = document.querySelector('#nTitle');
    const duration = document.querySelector('#nDuration');

    return { title: title.value, duration: convertTime('ms', duration.value) };
}

function getQuestionData() {

    const text = document.querySelector('#questionTextInput');
    const opt1 = document.querySelector('#opt1');
    const opt2 = document.querySelector('#opt2');
    const opt3 = document.querySelector('#opt3');
    const opt4 = document.querySelector('#opt4');
    const correctOption = document.querySelector('#correctOption');
    const awardedPoints = document.querySelector('#awardedPoint');

    const options = [opt1.value, opt2.value];

    if (opt3.value) options.push(opt3.value);
    if (opt4.value) options.push(opt4.value);

    return {
        text: text.value,
        options: options,
        correct_option: correctOption.value,
        awarded_point: awardedPoints.value
    }
}

function getQuestionUpdate() {

    const text = document.querySelector('#nQuestionTextInput');
    const opt1 = document.querySelector('#nOpt1');
    const opt2 = document.querySelector('#nOpt2');
    const opt3 = document.querySelector('#nOpt3');
    const opt4 = document.querySelector('#nOpt4');
    const correctOption = document.querySelector('#nCorrectOption');
    const awardedPoints = document.querySelector('#nAwardedPoint');

    const options = [opt1.value, opt2.value];

    if (opt3.value) options.push(opt3.value);
    if (opt4.value) options.push(opt4.value);

    return {
        text: text.value,
        options: options,
        correct_option: correctOption.value,
        awarded_point: awardedPoints.value
    }
}

(function () {

    document.querySelector('form').onsubmit = (e) => e.preventDefault();

    document.body.addEventListener('click', async (e) => {

        if (e.target.tagName !== 'BUTTON') return;

        if (e.target.textContent.toLowerCase() === 'add question') {

            questions[questions.length - 1]?.text === getQuestionData().text
                ? questions[questions.length - 1] = getQuestionData()
                : questions.push(getQuestionData());

            localStorage.setItem('questions', JSON.stringify(questions));
            createNotification('pageAlert', 'Question added to memory', 'success');
        }

        if (e.target.textContent.toLowerCase() === 'save quiz') {

            await createQuiz('pageAlert', {
                ...getQuizData(),
                questions: questions.length > 0 ? questions : [getQuestionData()]
            })

            localStorage.clear();
            await renderQuiz();
        }

        if (e.target.id === 'publishQuiz') {

            await publishQuiz('pageAlert', e.target.parentElement.parentElement.id);

            document.querySelector('#publishQuiz').disabled = true;
            document.querySelector('#updateQuiz').disabled = true;
            document.querySelector('#deleteQuiz').disabled = true;

        }

        if (e.target.id === 'deleteQuiz') {

            await deleteQuiz('pageAlert', e.target.parentElement.parentElement.id);
            await renderQuiz();
        }

        if (e.target.id === 'updateQuiz') {

            quizUpdateDialogue(
                e.target.parentElement.parentElement.id,
                e.target.parentElement.parentElement.children[1].textContent,
                e.target.parentElement.parentElement.children[2].textContent
            );
        }

        if (e.target.id === 'deleteQuestion') {

            await deleteQuestion('pageAlert', e.target.parentElement.parentElement.id)
        }

        if (e.target.id === 'updateQuestion') {

            const questionID = e.target.parentElement.parentElement.id.split('_')[0];
            const quizID = e.target.parentElement.parentElement.id.split('_')[1];

            questionUpdateDialogue(
                questionID,
                quizID,
                e.target.parentElement.parentElement.children[1].textContent,
                e.target.parentElement.parentElement.children[2].children[0].children[0].textContent,
                e.target.parentElement.parentElement.children[2].children[0].children[1].textContent,
                e.target.parentElement.parentElement.children[2].children[0].children[2].textContent,
                e.target.parentElement.parentElement.children[2].children[0].children[3].textContent,
                e.target.parentElement.parentElement.children[3].textContent,
                e.target.parentElement.parentElement.children[4].textContent
            );
        }

        if (e.target.textContent.toLowerCase() === 'update quiz') {

            await updateQuiz(
                'pageAlert',
                e.target.parentElement.id.split('_')[1],
                getQuizUpdate()
            );
            document.querySelector('.box_overlay').remove()
            await renderQuiz();
        }

        if (e.target.textContent.toLowerCase() === 'update question') {

            await updateQuestion(
                'pageAlert',
                e.target.parentElement.id.split('_')[2],
                e.target.parentElement.id.split('_')[1],
                getQuestionUpdate()
            )
            renderQuestion(e.target.parentElement.id.split('_')[2])
            document.querySelector('.box_overlay').remove()
        }
        if (e.target.id === 'abort') {

            document.querySelector('.box_overlay').remove()
        }
    })
})()

renderQuiz();