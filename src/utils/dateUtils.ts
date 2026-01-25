const today = new Date();
today.toLocaleString('ru-RU', { month: 'long' });

export function getCurrentDate() {
    return today;
}

export function getNextDay() {
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
}

export function getNextWeek() {
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
}

export function getNextTwoWeek() {
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
}

export function getNextMonth() {
    return new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
}
