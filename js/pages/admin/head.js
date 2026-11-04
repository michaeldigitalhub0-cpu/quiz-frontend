import { createUser, deleteUser, getHod, updateUserAdmin } from "../../api/users.api.js";
import createNotification from "../../utils/alert.js";
import { userUpdateDialogue } from "../../utils/dom.js";

function getUserData() {

    const firstName = document.querySelector('#firstName');
    const lastName = document.querySelector('#lastName');
    const middleName = document.querySelector('#middleName');
    const email = document.querySelector('#userEmail');

    if (!middleName.value.trim()) {
        return {
            fName: firstName.value.trim(),
            lName: lastName.value.trim(),
            email: email.value.trim(),
            user_role: 'hod'
        }
    }

    return {
        fName: firstName.value.trim(),
        lName: lastName.value.trim(),
        mName: middleName.value.trim(),
        email: email.value.trim(),
        user_role: 'hod'
    }
}

function getUserUpdate() {

    const firstName = document.querySelector('#nFName');
    const lastName = document.querySelector('#nLName');
    const middleName = document.querySelector('#nMName');
    const email = document.querySelector('#nEmail');
    const userRole = document.querySelector('#nRole');
    const password = document.querySelector('#nPassword');
    const confirmPassword = document.querySelector('#confirmPassword');

    if (!middleName.value.trim()) {
        return {
            fName: firstName.value.trim(),
            lName: lastName.value.trim(),
            email: email.value.trim(),
            user_role: userRole.value,
            password: password.value,
            confirmPassword: confirmPassword.value
        }
    }

    return {
        fName: firstName.value.trim(),
        lName: lastName.value.trim(),
        mName: middleName.value.trim(),
        email: email.value.trim(),
        user_role: userRole.value,
        password: password.value,
        confirmPassword: confirmPassword.value
    }
}

async function renderRecords() {

    const data = await getHod('pageAlert');

    const table = document.querySelector('#hodBody');
    if (data.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4">
                  <div class="empty-state">No HOD added yet.</div>
                </td>
              </tr>
        `;
        return;
    }

    table.innerHTML = data.map(record => `
        <tr>
            <td>${record.user_id}</td>
            <td>${record.full_name}</td>
            <td>${record.email}</td>
            <td id="${record.user_id}"><button class="btn btn-sm btn-secondary">Update</button><button class="btn btn-sm btn-secondary">Delete</button></td>
        </tr>
    `).join('');
}

(function () {
    const searchInput = document.querySelector('#hodSearch');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const rows = document.querySelectorAll('#hodBody tr');

        rows.forEach(row => {
            const cells = row.children;
            if (cells.length < 2) return;

            const name = cells[1].textContent.toLowerCase();
            const email = cells[2].textContent.toLowerCase();

            row.style.display = (name.includes(query) || email.includes(query)) ? '' : 'none';
        });
    });
})();

(function () {

    document.querySelectorAll('form').forEach(el => el.onsubmit = (e) => e.preventDefault());

    document.body.addEventListener('click', async (e) => {

        if (e.target.tagName !== 'BUTTON') return;

        if (e.target.textContent === 'Create user') {

            if (!(/^([a-z]|[A-Z])+@[a-z]+.com$/.test(getUserData().email)))
                return createNotification('pageAlert', 'Please input a valid email address');

            await createUser('pageAlert', getUserData());
            await renderRecords();
        }

        if (e.target.textContent === 'Delete') {

            await deleteUser('pageAlert', e.target.parentElement.id);
            await renderRecords();
        }

        if (e.target.textContent === 'Update') {

            const full_name = e.target.parentElement.parentElement.children[1].textContent.split(' ');
            userUpdateDialogue(
                e.target.parentElement.id,
                full_name[0],
                full_name[1],
                full_name[2] || '',
                'hod',
                e.target.parentElement.parentElement.children[2].textContent
            );
        }

        if (e.target.id === 'update') {

            const { fName, lName, mName, email, role, password, confirmPassword } = getUserUpdate();

            if (password || confirmPassword) {
                if (!password)
                    return createNotification('pageAlert', 'Provide new password', 'error');

                if (!confirmPassword)
                    return createNotification('pageAlert', 'Enter new password again', 'error');

                if (password.length < 8)
                    return createNotification('pageAlert', 'Password length must be 8 characters or more', 'error');

                if (confirmPassword !== password)
                    return createNotification('pageAlert', 'Password does not match', 'error');

                await updateUserAdmin('pageAlert', e.target.parentElement.id, { fName, lName, mName, role, email, password });
                await renderRecords();
                document.querySelector('.box_overlay').remove();
                return;
            }

            await updateUserAdmin('pageAlert', e.target.parentElement.id, { fName, lName, mName, role, email });
            await renderRecords();
            document.querySelector('.box_overlay').remove();
        }

        if (e.target.id === 'abort') {

            document.querySelector('.box_overlay').remove();
        }

    })
})();

renderRecords();