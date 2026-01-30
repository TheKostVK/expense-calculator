/**
 * Возвращает дату "сегодня" в 00:00:00.000
 */
export function getCurrentDate(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Завтрашний день (00:00).
 */
export function getNextDay(): Date {
    const today = getCurrentDate();
    today.setDate(today.getDate() + 1);
    return today;
}

/**
 * Дата через неделю (00:00).
 */
export function getNextWeek(): Date {
    const today = getCurrentDate();
    today.setDate(today.getDate() + 7);
    return today;
}

/**
 * Дата через две недели (00:00).
 */
export function getNextTwoWeek(): Date {
    const today = getCurrentDate();
    today.setDate(today.getDate() + 14);
    return today;
}

/**
 * Дата через месяц (00:00).
 */
export function getNextMonth(): Date {
    const today = getCurrentDate();
    today.setMonth(today.getMonth() + 1);
    return today;
}

/**
 * Последний день текущего месяца (00:00).
 */
export function getLastDayOfCurrentMonth(): Date {
    const today = getCurrentDate();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0);
}
