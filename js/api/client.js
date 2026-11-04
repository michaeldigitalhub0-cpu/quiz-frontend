
const origin = 'https://quiz-management-system-backend-w1cw.onrender.com';

async function apiFetch(path, options) {

    const response = await fetch(`${origin}/api${path}`, {
        ...options,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 403) {

        const refresh = await fetch(`${origin}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include'
        });

        if (refresh.ok) {

            return fetch(`${origin}/api${path}`, {
                ...options,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
        }

        sessionStorage.clear();
        window.location.href = '../../pages/login.html';
        return;
    }

    return response;
}

export default apiFetch;
