import { getUser, logout } from "./api/api.auth.js";

(async function () {

    const data = await getUser();

    sessionStorage.setItem('role', data.user_role);
    sessionStorage.setItem('userId', data.user_id);

    document.querySelector('#userRole').textContent = data.user_role;
    document.querySelector('#userName').textContent = data.fName;

    document.querySelector('#logoutBtn').onclick = async () => {

        await logout('pageAlert');
        sessionStorage.clear();
        window.location.href = '../../pages/login.html';
    };
})();

