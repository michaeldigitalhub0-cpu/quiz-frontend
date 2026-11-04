function createNotification(element_id, info, type) {

    const notification = document.querySelector(`#${element_id}`);
    const msg = document.createElement('p');

    notification.innerHTML = '';
    notification.style.display = 'block';

    notification.setAttribute('class', `alert alert--${type}`);

    msg.setAttribute('class', 'alert--info');
    msg.textContent = info;

    notification.appendChild(msg);

    setTimeout(() => {
        notification.style.display = 'none';
    }, 1500);

}

export default createNotification; 