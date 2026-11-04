import { deleteEnrollment, enrollStudent, getCourses, getStudentEnrollments } from "../../api/courses.api.js";
import { enrollCourse, unenrollCourse } from "../../utils/dom.js";

const student_id = sessionStorage.getItem('userId');
async function setDetails() {

    const enrolledPlaceholder = document.querySelector('#statEnrolled');
    const coursesPlaceholder = document.querySelector('#statOpenCourses');

    const [enrolled, courses] = await Promise.all([
        await getStudentEnrollments('pageAlert', student_id),
        await getCourses('pageAlert')
    ])


    enrolledPlaceholder.textContent = enrolled.length;
    coursesPlaceholder.textContent = courses.length - enrolled.length;

}

async function renderRecords() {

    const data = await getStudentEnrollments('pageAlert', student_id);

    const table = document.querySelector('#courseBody');

    if (data.length === 0) {

        table.innerHTML = `
             <tr>
                <td colspan="4">
                  <div class="empty-state">You are not enrolled in any course yet.</div>
                </td>
              </tr>
        `;
        return;
    }
    table.innerHTML = data.map(record => `
        <tr>
            <td>${record.code}</td>
            <td>${record.description}</td>
            <td>${record.instructor || 'No assigned Instructor'}</td>
            <td>
                <button class="btn btn-sm btn-secondary" id="dropCourse">Drop course</button>
            </td>
        </tr>    
    `).join('');
}

(function () {

    document.body.addEventListener('click', async (e) => {

        if (e.target.tagName !== 'BUTTON') return;

        if (e.target.id === 'dropCourse') {

            unenrollCourse(e.target.parentElement.parentElement.children[0].textContent.trim());
        }

        if (e.target.textContent === 'Unenroll') {

            const courseCode = e.target.id;

            if (courseCode.trim() !== document.querySelector('#courseTitle').value.trim()) {
                document.querySelector('#confirmCourseError').textContent = 'course code do not match';
                return;
            }

            await deleteEnrollment(courseCode, student_id, 'pageAlert');
            document.querySelector('.modal-overlay').remove();
            await setDetails();
            await renderRecords();
        }

        if (e.target.id === 'addCourse') {

            enrollCourse();
        }

        if (e.target.textContent === 'Enroll') {

            const selectedCourse = document.querySelector('#courses').value;

            const courseCode = document.querySelector('#courseTitle').value.trim();

            if (selectedCourse !== courseCode) {
                document.querySelector('#confirmCourseError').textContent = 'course code do not match';
                return;
            }

            await enrollStudent({ student: student_id, course: courseCode }, 'pageAlert');
            document.querySelector('.modal-overlay').remove();
            await setDetails();
            await renderRecords();
        }

        if (e.target.id === 'abort') {
            document.querySelector('.modal-overlay').remove();
        }
    })
})()

setDetails();
renderRecords();