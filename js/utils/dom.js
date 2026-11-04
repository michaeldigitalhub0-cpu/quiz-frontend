import { getCourses } from "../api/courses.api.js";
import { getInstructors } from "../api/users.api.js";

async function loadCourses(htmlSelectElement) {

    const data = await getCourses('pageAlert');

    const selectElement = document.querySelector(`#${htmlSelectElement}`);

    selectElement.innerHTML = '<option value="" selected disabled>Select a course</option>';
    data.forEach(record => {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', record.code);
        optionElement.textContent = record.code;
        selectElement.appendChild(optionElement);
    });
}

function quizUpdateDialogue(id, title, duration) {
    const overlay = document.createElement('div');
    overlay.className = 'box_overlay';
    const box = document.createElement('div');
    box.id = 'update_box';
    const html = `
        <div class="card__header">
            <h3 style="margin-top: 14px;">Update Quiz</h3>
        </div>
        <div class="form-grid">
            <div class="field">
                <label for="nTitle">Title</label>
                <input type="text" name="nTitle" id="nTitle" maxlength="100" value="${title}"/>
            </div>
            <div class="field">
                <label for="nDuration">Duration</label>
                <input type="number" name="nDuration" id="nDuration" value="${duration}"/>
            </div>
            <div class="form-actions"  id="quiz_${id}">
                <button type="submit" class="btn btn-primary" id="update">Update quiz</button>
                <button type="submit" class="btn btn-secondary" id="abort">Abort</button>
            </div>
        </div>
    `;
    box.innerHTML = html;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

function questionUpdateDialogue(id, quiz_id, text, opt1, opt2, opt3, opt4, correct_option, awarded_point) {
    const overlay = document.createElement('div');
    overlay.className = 'box_overlay';
    const box = document.createElement('div');
    box.id = 'update_box';
    const html = `
            <div class="card__header">
                <h3 style="margin-top: 14px;">Update Question</h3>
            </div>
            <div class="field field--wide"><label for="nQuestionTextInput">Question</label><textarea
                id="nQuestionTextInput" required></textarea></div>
            <div class="field"><label for="nOpt1">Option A</label><input type="text" id="nOpt1" maxlength="255"
                value="${opt1}" required />
            </div>
            <div class="field"><label for="nOpt2">Option B</label><input type="text" id="nOpt2" maxlength="255"
               value="${opt2}" required />
            </div>
            <div class="field"><label for="nOpt3">Option C (optional)</label><input type="text" id="nOpt3"
               value="${opt3}" maxlength="255" />
            </div>
            <div class="field"><label for="nOpt4">Option D (optional)</label><input type="text" id="nOpt4"
               value="${opt4}" maxlength="255" />
            </div>
            <div class="field"><label for="nCorrectOption">Correct option</label><select id="nCorrectOption" required>
                <option value="" disabled selected>Select</option>
                <option value="1">A</option>
                <option value="2">B</option>
                <option value="3">C</option>
                <option value="4">D</option>
              </select></div>
            <div class="field"><label for="nAwardedPoint">Awarded Point</label><input type="number" id="nAwardedPoint"
                value="${awarded_point}" required />
            </div>
            <div class="form-actions"  id="question_${id}_${quiz_id}">
                <button type="submit" class="btn btn-primary" id="update">Update question</button>
                <button type="submit" class="btn btn-secondary" id="abort">Abort</button>
            </div>
    `;
    box.innerHTML = html;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    document.querySelector('#nQuestionTextInput').value = text;

    const selectElement = document.querySelector('#nCorrectOption');

    Array.from(selectElement.children).forEach((opt, i) => {

        opt.value === correct_option
            ? selectElement.children[i].selected = true
            : selectElement.children[i].selected = false;
    });
}

async function courseUpdateDialogue(code, instructor, description) {

    const overlay = document.createElement('div');
    overlay.className = 'box_overlay';
    const box = document.createElement('div');
    box.id = 'update_box';
    const html = `
            <div class="card__header">
                <h3 style="margin-top: 14px;">Update Course</h3>
            </div>
            <div class="field"><label for="code">Course code</label><input
                type="text" id="code" maxlength="7" value="${code} "disabled></div>
            <div class="field"><label for="nCourseDescription">Description</label><input
                type="text" id="nCourseDescription" maxlength="100" value="${description}" required></div>
            <div class="field"><label for="nInstructor">Instructor</label><select id="nInstructor" required>
                <option value="" disabled selected>Select</option>
               
              </select></div>
            
            <div class="form-actions"  id="${code}">
                <button type="submit" class="btn btn-primary" id="updateCourse">Update course</button>
                <button type="submit" class="btn btn-secondary" id="abort">Abort</button>
            </div>
    `;
    box.innerHTML = html;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const selectElement = document.querySelector('#nInstructor');

    selectElement.innerHTML = '<option value="" selected disabled>Select instructor</option>';
    const data = await getInstructors('pageAlert');
    data.forEach(record => {

        const opt = document.createElement('option');
        opt.setAttribute('value', record.user_id);
        opt.textContent = record.full_name;

        selectElement.appendChild(opt);
    })

    Array.from(selectElement.children).forEach((opt, i) => {

        opt.value === instructor
            ? selectElement.children[i].selected = true
            : selectElement.children[i].selected = false;
    });

}

function userUpdateDialogue(id, fName, lName, mName, role, email) {
    const overlay = document.createElement('div');
    overlay.className = 'box_overlay';
    const box = document.createElement('div');
    box.id = 'update_box';
    const html = `
        <div class="card__header">
            <h3 style="margin-top: 14px;">Update user details</h3>
        </div>
            <div class="field">
                <label for="nFName">First name</label>
                <input type="text" name="nFName" id="nFName" maxlength="15" value="${fName}"/>
            </div>
            <div class="field">
                <label for="nLName">Last Name</label>
                <input type="text" name="nLName" id="nLName" maxlength="15" value="${lName}"/>
            </div>
            <div class="field">
                <label for="nMName">Middle Name</label>
                <input type="text" name="nMName" id="nMName" maxlength="15" value="${mName}"/>
            </div>
            <div class="field"><label for="nRole">User role</label><select id="nRole" disabled>
                <option value="" disabled selected>Select</option>
                <option value="admin">Database Admin</option>
                <option value="hod">Head of Department</option>
                <option value="instructor">Instructor</option>
                <option value="student">Student</option>
              </select></div>
            <div class="field">
                <label for="nEmail">Email</label>
                <input type="email" name="nEmail" id="nEmail" maxlength="100" value="${email}"/>
            </div>
            <div class="field">
                <label for="nPassword">Password</label>
                <input type="password" name="nPassword" id="nPassword" minlength="8"/>
            </div>
            <div class="field">
                <label for="confirmPassword">Confirm password</label>
                <input type="password" name="confirmPassword" id="confirmPassword" minlength="8"/>
            </div>
            <div class="field settings-toggle">
                <label class="settings-toggle__label">
                  <input type="checkbox" id="showPasswords" />
                  Show passwords
                </label>
            </div>
            <div class="form-actions"  id="${id}">
                <button type="submit" class="btn btn-primary" id="update">Update user</button>
                <button type="submit" class="btn btn-secondary" id="abort">Abort</button>
            </div>
        
    `;
    box.innerHTML = html;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const selectElement = document.querySelector('#nRole');
    Array.from(selectElement.children).forEach((opt, i) => {

        opt.value === role
            ? selectElement.children[i].selected = true
            : selectElement.children[i].selected = false;
    });

    document.querySelector('#showPasswords').onchange = () => {

        const status = document.querySelector('#showPasswords').checked;

        const newPassword = document.querySelector('#nPassword');
        const confirmPassword = document.querySelector('#confirmPassword');

        if (status) {

            newPassword.setAttribute('type', 'text');
            confirmPassword.setAttribute('type', 'text');

        } else {

            newPassword.setAttribute('type', 'password');
            confirmPassword.setAttribute('type', 'password');
        }
    }
}

function unenrollCourse(course) {

    const box = document.createElement('div');
    box.className = 'modal-overlay';
    box.id = 'unenrollModal';
    box.role = 'dialog';
    box.ariaModal = 'true';
    box.ariaLabel = 'unenrollModalTitle';

    box.innerHTML = `
        <div class="modal-box modal-box--form">
            <h3 class="modal-box__title" id="unenrollModalTitle">Unenroll from ${course}?</h3>
            <p class="modal-box__subtitle" id="unenrollModalSub">Type the course title to unenroll</p>
            <div class="field">
                <label for="courseTitle">Course Title</label>
                <input type="text" name="courseTitle" id="courseTitle" required>
                    <span class="field__error" id="confirmCourseError"></span>
            </div>
            <div class="form-actions"><button type="button" class="btn btn-danger"
                id="${course}">Unenroll</button><button type="button" class="btn btn-secondary"
                    id="abort">Cancel</button></div>
        </div>
    `;

    document.body.appendChild(box)
}

async function enrollCourse() {

    const box = document.createElement('div');
    box.className = 'modal-overlay';
    box.id = 'unenrollModal';
    box.role = 'dialog';
    box.ariaModal = 'true';
    box.ariaLabel = 'enrollModalTitle';

    box.innerHTML = `

        <div class="modal-box modal-box--form">
            <h3 class="modal-box__title" id="enrollModalTitle">Enroll Course: Select and type the name of the course to
                enroll</h3>
            <div class="field">
            <select name="courses" id="courses">
              <option value="" selected disabled>Select a course</option>
            </select>
          </div>
          <div class="field">
            <label for="courseTitle">Course Code</label>
            <input type="text" name="courseTitle" id="courseTitle" required>
            <span class="field__error" id="confirmCourseError"></span>
          </div>
          <div class="form-actions"><button type="button" class="btn btn-secondary"
              id="enrollCourse">Enroll</button><button type="button" class="btn btn-secondary"
              id="abort">Cancel</button></div>
        </div>
    `;

    document.body.appendChild(box);

    await loadCourses('courses')
}

export {
    questionUpdateDialogue,
    quizUpdateDialogue,
    courseUpdateDialogue,
    userUpdateDialogue,
    loadCourses,
    enrollCourse,
    unenrollCourse
};