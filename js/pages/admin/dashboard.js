import { getHod, getInstructors, getStudents } from "../../api/users.api.js";

(async function () {

    const instructors = document.querySelector('#statInstructors');
    const hods = document.querySelector('#statHODs');
    const students = document.querySelector('#statStudents');

    const [instructorTotal, studentTotal, hodTotal] = await Promise.all([
        getInstructors('pageAlert'),
        getStudents('pageAlert'),
        getHod('pageAlert')
    ]);

    instructors.textContent = instructorTotal && instructorTotal.length || 0;
    hods.textContent = hodTotal && hodTotal.length || 0;
    students.textContent = studentTotal && studentTotal.length || 0;

})()