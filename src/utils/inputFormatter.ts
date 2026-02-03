export function onlyNumbersFormatter(evt: Event) {
    const target = evt.target as HTMLInputElement;

    target.value = target.value.replace(/[^0-9]/g, '');
}

export function currencyFormatterEvent(evt: Event) {
    const target = evt.target as HTMLInputElement;

    target.value = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(Number(target.value));
}

export function numberFormatterEvent(evt: Event) {
    const target = evt.target as HTMLInputElement;

    target.value = new Intl.NumberFormat('ru-RU', {
        style: 'decimal',
        maximumFractionDigits: 0,
    }).format(Number(target.value));
}

export function numberFormatter(value: string) {
    const reg = /\D/gi;

    return value.replace(reg, '');
}
