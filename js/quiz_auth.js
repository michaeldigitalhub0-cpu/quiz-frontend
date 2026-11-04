import { getStudent } from "./api/api.quiz_auth.js";

(async function setUserDetails() {

    const data = await getStudent();

    sessionStorage.setItem('role', 'student');
    sessionStorage.setItem('userId', data.student_id);
    sessionStorage.setItem('quiz', data.quiz_id);

})()


