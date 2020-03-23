
// get ms countdown in days/hours/minutes/seconds
export function formatTimeFromMs(ms) {
    if (ms >= 86400000) {
        const days = Math.floor(ms / 86400000);
        const hours = Math.floor((ms - 86400000 * days) / 3600000);

        const dayStr = (days === 1) ? ' day, ' : ' days, ';
        const hourStr = (hours === 1) ? ' hour' : ' hours';
        return days + dayStr + hours + hourStr;
    }
    else if (ms >= 3600000) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms - 3600000 * hours) / 60000);

        const hourStr = (hours === 1) ? ' hour, ' : ' hours, ';
        const minuteStr = (minutes === 1) ? ' minute' : ' minutes';
        return hours + hourStr + minutes + minuteStr;
    }
    else {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms - 60000 * minutes) / 1000);

        const minuteStr = (minutes === 1) ? ' minute, ' : ' minutes, ';
        const secondStr = (seconds === 1) ? ' second' : ' seconds';
        return minutes + minuteStr + seconds + secondStr;
    }
}   

// get start day of next matching (deadline)
export function getNextMatchingDate() {
    var now = new Date();    
    now.setUTCDate(now.getUTCDate() + (12 - now.getUTCDay()) % 7);
    return (now.getUTCMonth() + 1) + '-' + now.getUTCDate() + '-' + now.getUTCFullYear();
}

// get start day of last matching (deadline)
export function getCurrentMatchingDate() {
    var now = new Date();
    now.setUTCDate(now.getUTCDate() + (12 - now.getUTCDay()) % 7 - 7);
    return (now.getUTCMonth() + 1) + '-' + now.getUTCDate() + '-' + now.getUTCFullYear();
}