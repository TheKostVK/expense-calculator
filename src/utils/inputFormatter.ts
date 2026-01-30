export function onlyNumbersFormatter(evt: Event) {
    const target = evt.target as HTMLInputElement;

    target.value = target.value.replace(/[^0-9]/g, '');
}

export function currencyFormatter(evt: Event) {
    const target = evt.target as HTMLInputElement;

    target.value = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0,
    }).format(Number(target.value));
}
