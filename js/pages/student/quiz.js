import { getStudent, quizLogout } from "../../api/api.quiz_auth.js";
import { getQuizStudent, submitQuiz } from "../../api/quizzes.api.js";

let count = 0;

async function setAttemptTemplate() {

    const quiz = await getQuizStudent();
    console.log(quiz);
    const quizAttempt = {
        quiz_id: quiz.id,
        attempt: []
    }

    quiz.questions.data.forEach(question => {
        quizAttempt.attempt.push({
            question_id: question.id,
            selected_option: null
        })
    })

    localStorage.setItem('quiz', JSON.stringify(quiz));

    if (!(localStorage.getItem('quiz_attempt'))) localStorage.setItem('quiz_attempt', JSON.stringify(quizAttempt));

}

function setDetails() {

    const quiz = JSON.parse(localStorage.getItem('quiz'));

    const course = document.querySelector('#quizTitle');
    const title = document.querySelector('#quizCourse');

    course.textContent = quiz.course;
    title.textContent = quiz.title;

    setTimer(quiz.duration - (quiz.questions.server_time - quiz.questions.started_at));
}

function setTimer(quiz_duration) {

    const timer = document.querySelector('#examTimer');

    let hours = Math.floor(quiz_duration / (1000 * 60 * 60));
    let minuites = Math.floor(quiz_duration / (1000 * 60) % 60);
    let seconds = Math.floor(quiz_duration / (1000) % 60);

    timer.innerHTML = `${hours.toString().padStart(2, '0')}:${minuites.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const timerID = setInterval(async () => {

        seconds--;
        if (seconds < 0) {

            seconds = 59
            minuites--;

            if (minuites < 0) {

                minuites = 59;
                hours--;

                if (hours < 0) {

                    hours = 0;
                    minuites = 0;
                    seconds = 0;
                    clearInterval(timerID);
                    console.log('Time out');
                    return;
                }
            }
        }

        timer.innerHTML = `${hours.toString().padStart(2, '0')}:${minuites.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

        if (hours === 0 && minuites === 10 && seconds === 0) {
            timer.classList.add('is-low')
        }

        if (hours === 0 && minuites === 0 && seconds === 0) {

            const quizAttempt = JSON.parse(localStorage.getItem('quiz_attempt'));

            await submitQuiz('examAlert', quiz_id, quizAttempt);
            const submitModal = document.querySelector('#submitModal');

            submitModal.classList.remove('is-hidden');

            submitModal.children[0].querySelector('#submitModalSub').textContent = 'Your time is, quiz submitted';
            submitModal.children[0].remove();
            await quizLogout('examAlert');
            window.location.href = '../../pages/student/dashboard.html'
        }

    }, 1000);
}

function renderQuestion() {

    const quiz = JSON.parse(localStorage.getItem('quiz'));
    const quizAttempt = JSON.parse(localStorage.getItem('quiz_attempt'));
    const questionNo = document.querySelector('#questionNo');
    const questionText = document.querySelector('#questionText');

    function renderNext(questionNumber) {

        questionNo.textContent = `Question ${questionNumber + 1} out of ${quiz.questions.data.length}`;
        questionText.textContent = quiz.questions.data[questionNumber].text;

        const options = [quiz.questions.data[questionNumber].first_option, quiz.questions.data[questionNumber].second_option];

        if (quiz.questions.data[questionNumber].third_option) {
            options.push(quiz.questions.data[questionNumber].third_option);
        }

        if (quiz.questions.data[questionNumber].fourth_option) {
            options.push(quiz.questions.data[questionNumber].fourth_option);
        }

        renderOptions(options);

        const saved = quizAttempt.attempt[questionNumber].selected_option;

        if (saved) {
            const input = document.querySelector(`input[name="answer"][value="${saved}"]`);
            if (input) input.checked = true;
        }
    }

    function renderOptions(options) {

        const list = document.querySelector('#optionsList');

        let html = `<legend class="note" style="padding:0;">Choose one answer</legend>`;
        const lables = ['A', 'B', 'C', 'D'];

        options.forEach((opt, i) => {

            html += `
                <label class="option"><input type="radio" name="answer" value="${i + 1}" /><span class="option__key">${lables[i]}</span><span
            id="optionText${i + 1}">${opt}</span></label>
            `;
        })

        list.innerHTML = html;
    }

    return {
        renderNext
    }
}

function updateProgress() {

    const quizAttempt = JSON.parse(localStorage.getItem('quiz_attempt'));

    let progress = 0;

    quizAttempt.attempt.forEach(attempt => {
        if (attempt.selected_option)
            progress++;
    });

    document.querySelector('#answeredCount').textContent = `${progress} answered`;

    const percentage = (progress / quizAttempt.attempt.length) * 100;

    document.querySelector('#progressFill').style.width = `${Math.floor(percentage)}%`;
}

function setEventListeners() {

    document.body.addEventListener('click', async (e) => {

        const questions = JSON.parse(localStorage.getItem('quiz')).questions.data;

        if (e.target.id === 'prevBtn') {

            if (count > 0) count--;

            renderQuestion().renderNext(count);
            updatePalette(questions.length, count);
            return;

        }

        if (e.target.id === 'nextBtn') {

            if (count < questions.length - 1) count++;

            renderQuestion().renderNext(count);
            updatePalette(questions.length, count);
            return;

        }

        if (e.target.tagName === 'INPUT' && e.target.type === 'radio') {

            const quizAttempt = JSON.parse(localStorage.getItem('quiz_attempt'));

            quizAttempt.attempt[count].selected_option = e.target.value;
            localStorage.setItem('quiz_attempt', JSON.stringify(quizAttempt));

            updateProgress();
            updatePalette(questions.length, count);

        }

        if (e.target.id === 'submitBtn') {

            const submitDialogue = document.querySelector('#submitModal')

            submitDialogue.classList.remove('is-hidden');

            if (!(JSON.parse(localStorage.getItem('quiz_attempt')).attempt.some(attempt => attempt.selected_option === null))) {

                submitDialogue.children[0].querySelector('#submitModalSub').style.display = 'none';
            }

            submitDialogue.children[0].querySelector('#submitModalOk').onclick = async () => {

                const quizAttempt = JSON.parse(localStorage.getItem('quiz_attempt'));
                await submitQuiz('examAlert', quizAttempt);
                await quizLogout('examAlert');
                localStorage.clear();
                window.location.href = '../../../pages/student/dashboard.html';
            }

            submitDialogue.children[0].querySelector('#submitModalCancel').onclick = () => {

                submitDialogue.classList.add('is-hidden');
            }
        }

    })

}

function updatePalette(questionCount, index) {

    const pallete = document.querySelector('#palette');

    let html = '';

    for (let i = 0; i < questionCount; i++) {
        html += `
            <button type="button" class="palette__btn">${i + 1}</button>
        `
    }

    pallete.innerHTML = html;
    pallete.children[index].classList.add('is-current');

    const quizAttempt = JSON.parse(localStorage.getItem('quiz_attempt'));

    quizAttempt.attempt.forEach((attempt, i) => {
        if (attempt.selected_option)
            pallete.children[i].classList.add('is-answered');
    });
}

async function init() {

    await setAttemptTemplate();
    setDetails();
    renderQuestion().renderNext(0);
    updateProgress();
    updatePalette(JSON.parse(localStorage.getItem('quiz')).questions.data.length, 0);
    setEventListeners();
}

init();