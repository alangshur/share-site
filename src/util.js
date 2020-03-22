
// get ms countdown in days/hours/minutes/seconds
export function formatTimeFromMs(ms) {
    if (ms >= 86400000) {
        const days = Math.floor(ms / 86400000);
        const hours = Math.floor((ms - 86400000 * days) / 3600000);

        const dayStr = (days > 1) ? ' days, ' : ' day, ';
        const hourStr = (hours > 1) ? ' hours' : ' hour';
        return days + dayStr + hours + hourStr;
    }
    else if (ms >= 3600000) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms - 3600000 * hours) / 60000);

        const hourStr = (hours > 1) ? ' hours, ' : ' hour, ';
        const minuteStr = (minutes > 1) ? ' minutes' : ' minute';
        return hours + hourStr + minutes + minuteStr;
    }
    else {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms - 60000 * minutes) / 1000);

        const minuteStr = (minutes > 1) ? ' minutes, ' : ' minute, ';
        const secondStr = (seconds > 1) ? ' seconds' : ' second';
        return minutes + minuteStr + seconds + secondStr;
    }
}   