import { getCourse, getCourseEnrollments } from "../../api/courses.api.js";
import { getQuestions, getQuizAttemptsInstructor, getQuizInstructor } from "../../api/quizzes.api.js";
import { convertTime, getCurrentDay } from "../../utils/format.js";

async function setDetails() {

    const coursePlaceholder = document.querySelector('#statCourse');
    const studentPlaceholder = document.querySelector('#statStudents');
    const quizPlaceholder = document.querySelector('#statQuizzes');
    const publishedPlaceholder = document.querySelector('#statPublished');
    const submissionPlaceholder = document.querySelector('#statSubmissions');

    const course = await getCourse('pageAlert');

    if (course.length === 0) {
        coursePlaceholder.textContent = 'Un-assigned';
        studentPlaceholder.textContent = 0;
        quizPlaceholder.textContent = 0;
        publishedPlaceholder.textContent = 0;
        submissionPlaceholder.textContent = 0;
        return;
    }
    const enrollments = await getCourseEnrollments(course[0].code);
    const quiz = (await getQuizInstructor('pageAlert'));
    const currentQuiz = quiz.find(record => record.date_created === getCurrentDay());
    const attempts = currentQuiz && await getQuizAttemptsInstructor('pageAlert', currentQuiz.id)

    coursePlaceholder.textContent = course[0].code;
    studentPlaceholder.textContent = enrollments.length;
    quizPlaceholder.textContent = quiz.length
    publishedPlaceholder.textContent = quiz.filter(record => record.is_published === 1).length
    submissionPlaceholder.textContent = attempts && attempts.length || 0
}

(
    async function () {

        const table = document.querySelector('#quizBody');

        const quiz = (await getQuizInstructor('pageAlert'))

        if (quiz.length === 0) {

            table.innerHTML = `
               <tr>
                <td colspan="6">
                  <div class="empty-state">No quiz created yet</div>
                </td>
              </tr>
            `;
            return;
        }

        table.innerHTML = '';
        for (let record of quiz) {

            const row = document.createElement('tr');
            const course = document.createElement('td');
            const title = document.createElement('td');
            const duration = document.createElement('td');
            const question = document.createElement('td');
            const status = document.createElement('td');
            const submissions = document.createElement('td');

            course.textContent = record.course;
            title.textContent = record.title;
            duration.textContent = convertTime('min', record.duration);
            question.textContent = (await getQuestions('pageAlert', record.id)).length;
            status.textContent = record.is_published ? 'Published' : 'Not published';
            submissions.textContent = (await getQuizAttemptsInstructor('pageAlert', record.id)).length;

            row.appendChild(course);
            row.appendChild(title);
            row.appendChild(duration);
            row.appendChild(question);
            row.appendChild(status);
            row.appendChild(submissions);

            table.appendChild(row);
        }
    }
)();
setDetails();