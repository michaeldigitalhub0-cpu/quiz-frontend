
const TZ = 'Africa/Lagos';

function getCurrentDay() {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: TZ,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());
};

function getCurrentTime() {
    return new Intl.DateTimeFormat('en-GB', {
        timeZone: TZ,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(new Date());
};

function getCurrentDayName() {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: TZ,
        weekday: 'long',
    }).format(new Date()).toLowerCase();
};

function convertTime(format, value) {

    if (format === 'min') {
        return (Number(value) / (1000 * 60));
    }

    if (format === 'ms') {
        return (Number(value) * 1000 * 60);
    }
}
export { getCurrentDay, getCurrentDayName, getCurrentTime, convertTime };