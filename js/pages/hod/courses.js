import { createCourse, deleteCourse, getCourseEnrollments, getCourses, getTotalQuizzes, updateCourse } from "../../api/courses.api.js";
import { getInstructors, getStudents } from "../../api/users.api.js";
import createNotification from "../../utils/alert.js";
import { courseUpdateDialogue } from "../../utils/dom.js";

function getCourseData() {

    const courseCode = document.querySelector('#courseCode');
    const courseTitle = document.querySelector('#courseTitle');
    const instructor = document.querySelector('#courseInstructor');

    if (!instructor.value)
        return {
            code: courseCode.value,
            description: courseTitle.value.trim(),
        }

    return {
        code: courseCode.value,
        description: courseTitle.value.trim(),
        instructor: instructor.value
    }
}

function getCourseUpdate() {

    const description = document.querySelector('#nCourseDescription');
    const instructor = document.querySelector('#nInstructor');

    return {
        description: description.value.trim(),
        instructor: instructor.value.trim()
    }

}

async function renderCourse() {

    const data = await getCourses('pageAlert');

    const table = document.querySelector('#courseBody');

    if (data.length === 0) {

        table.innerHTML = `
             <tr>
                <td colspan="6">
                  <div class="empty-state">No courses yet.</div>
                </td>
              </tr>
        `;
        return;
    }

    table.innerHTML = '';
    for (let record of data) {

        const row = document.createElement('tr');
        const code = document.createElement('td');
        const description = document.createElement('td');
        const instructor = document.createElement('td');
        const students = document.createElement('td');
        const quizzes = document.createElement('td');
        const actions = document.createElement('td');

        const data = await getInstructor(record.instructor);

        code.textContent = record.code;
        description.textContent = record.description;
        instructor.textContent = data && data.full_name || 'unassigned';
        instructor.id = data && data.user_id || 'unassigned';
        students.textContent = (await getCourseEnrollments(record.code)).length || 0;
        quizzes.textContent = (await getTotalQuizzes('pageAlert', record.code)) || 0;
        actions.innerHTML = `
            <button class="btn btn-sm btn-secondary">Update</button>
            <button class="btn btn-sm btn-secondary">Delete</button>
        `;
        actions.id = record.code;

        row.appendChild(code);
        row.appendChild(description);
        row.appendChild(instructor);
        row.appendChild(students);
        row.appendChild(quizzes);
        row.appendChild(actions);

        table.appendChild(row);
    }

    async function getInstructor(id) {

        return (await getInstructors('pageAlert')).find(i => i.user_id === id);
    }
}

(function () {
    const searchInput = document.querySelector('#courseSearch');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const rows = document.querySelectorAll('#courseBody tr');

        rows.forEach(row => {
            const cells = row.children;
            if (cells.length < 2) return;

            const code = cells[0].textContent.toLowerCase();
            const title = cells[1].textContent.toLowerCase();

            row.style.display = (code.includes(query) || title.includes(query)) ? '' : 'none';
        });
    });
})();

async function setDetails() {

    const courses = document.querySelector('#statCourses');
    const instructors = document.querySelector('#statInstructors');
    const students = document.querySelector('#statStudents');

    const [courseTotal, instructorTotal, enrollmentTotal] = await Promise.all([
        getCourses('pageAlert'),
        getInstructors('pageAlert'),
        getStudents('pageAlert')
    ]);

    courses.textContent = courseTotal.length;
    instructors.textContent = instructorTotal.length;
    students.textContent = enrollmentTotal.length;
}

(async function loadInstructor() {

    const data = await getInstructors('pageAlert');
    const selectElement = document.querySelector('#courseInstructor');

    selectElement.innerHTML = '<option value="" selected disabled>Select instructor</option>';
    data.forEach(record => {

        const opt = document.createElement('option');
        opt.setAttribute('value', record.user_id);
        opt.textContent = record.full_name;

        selectElement.appendChild(opt);
    })

})();

(function () {

    document.querySelector('form').onsubmit = (e) => e.preventDefault();

    document.body.addEventListener('click', async (e) => {

        if (e.target.tagName !== 'BUTTON') return;

        if (e.target.textContent === 'Create course') {

            if (!(/^[A-Z]+\d+$/.test(getCourseData().code)))
                return createNotification('pageAlert', 'Please input a valid course code', 'error');

            await createCourse('pageAlert', getCourseData());
            await renderCourse();
            await setDetails();
        }

        if (e.target.textContent === 'Delete') {

            await deleteCourse('pageAlert', e.target.parentElement.id);
            await renderCourse();
            await setDetails();
        }

        if (e.target.textContent === 'Update') {

            await courseUpdateDialogue(
                e.target.parentElement.parentElement.children[0].textContent,
                e.target.parentElement.parentElement.children[2].id,
                e.target.parentElement.parentElement.children[1].textContent
            );

        }

        if (e.target.id === 'updateCourse') {

            await updateCourse('pageAlert', getCourseUpdate(), e.target.parentElement.id);
            document.querySelector('.box_overlay').remove();
            await renderCourse();
            await setDetails();
        }

        if (e.target.id === 'abort') {

            document.querySelector('.box_overlay').remove();
        }
    })
})();

await setDetails();
renderCourse();