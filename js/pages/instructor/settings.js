import { getAdmins, getHod, getInstructors, getStudents, updateUser } from "../api/users.api.js";

const role = sessionStorage.getItem('role');
const id = sessionStorage.getItem('userId');

function getData() {

    const email = document.querySelector('#email');
    const currentPassword = document.querySelector('#currentPassword');
    const newPassword = document.querySelector('#newPassword');
    const confirmPassword = document.querySelector('#confirmPassword');

    return {
        email: email.value.trim(),
        currentPassword: currentPassword.value.trim(),
        newPassword: newPassword.value.trim(),
        confirmPassword: confirmPassword.value.trim()
    }
}

async function setDetails() {

    const detailID = document.querySelector('#detailID');
    const detailName = document.querySelector('#detailName');
    const detailRole = document.querySelector('#detailRole');
    const detailContact = document.querySelector('#detailEmail');

    const details = (await getInstructors('PageAlert')).find(record => record.user_id === id);
    detailID.value = details.user_id
    detailName.value = details.full_name
    detailRole.value = role.toUpperCase();
    detailContact.value = details.email;
}

document.querySelectorAll('form').forEach(el => el.addEventListener('submit', (e) => {
    e.preventDefault();
}))

document.querySelector('#saveEmailBtn').onclick = async () => {

    const { email } = getData();

    if (!email)
        return document.querySelector('#emailError').textContent = 'No contact data provided';

    if (!(/^[a-z]|[A-Z]+@[a-z]+.com$/.test(email)))
        return document.querySelector('#emailError').textContent = 'Invalid email';

    await updateUser('pageAlert', id, { email });
    await setDetails();
};

document.querySelector('#savePasswordBtn').onclick = async () => {

    const { currentPassword, newPassword, confirmPassword } = getData();

    if (!currentPassword)
        return document.querySelector('#currentPasswordError').textContent = 'Provide current password';

    if (!newPassword)
        return document.querySelector('#newPasswordError').textContent = 'Provide new password';

    if (!confirmPassword)
        return document.querySelector('#confirmPasswordError').textContent = 'Enter new password again';

    if (newPassword.length < 8)
        return document.querySelector('#newPasswordError').textContent = 'Password length must be 8 characters or more';

    if (confirmPassword !== newPassword)
        return document.querySelector('#newPasswordError').textContent = 'Password does not match';

    await updateUser('pageAlert', id, { newPassword, currentPassword });

};

document.querySelector('#showPasswords').onchange = () => {

    const status = document.querySelector('#showPasswords').checked;

    const currentPassword = document.querySelector('#currentPassword');
    const newPassword = document.querySelector('#newPassword');
    const confirmPassword = document.querySelector('#confirmPassword');

    if (status) {
        currentPassword.setAttribute('type', 'text');
        newPassword.setAttribute('type', 'text');
        confirmPassword.setAttribute('type', 'text');

    } else {
        currentPassword.setAttribute('type', 'password');
        newPassword.setAttribute('type', 'password');
        confirmPassword.setAttribute('type', 'password');
    }
}

await setDetails();