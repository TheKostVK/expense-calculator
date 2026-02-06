/**
 * Стабильный dateFormatter
 */
export function dateFormatter(date: Date): string {
    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
    }).format(date);
}

/**
 * Стабильный dateFormatter
 * Формат: "26 02 2026"
 */
export function dateFullFormatter(date: Date): string {
    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    }).format(date);
}
