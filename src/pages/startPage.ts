import { Calendar } from '../components/calendar/calendar.ts';
import { DateSelector } from '../components/calendar/dateSelector.ts';
import { currencyFormatterEvent, numberFormatter, onlyNumbersFormatter } from '../utils/inputFormatter.ts';

export const startPage = () => {
    const page = document.createElement('div');
    page.classList.add('page');

    const main = document.createElement('section');
    main.classList.add('main');

    const cardBlock = document.createElement('div');
    cardBlock.classList.add('card-block');

    const title = document.createElement('h1');
    title.classList.add('card__title');
    title.textContent = 'Начнём!';

    const body = document.createElement('div');
    body.classList.add('card__body');

    const form = document.createElement('form');
    form.name = 'welcome';
    form.classList.add('form');

    /* label.input */
    const balanceLabel = document.createElement('label');
    balanceLabel.classList.add('input');

    const balanceTitle = document.createElement('span');
    balanceTitle.classList.add('input__title', 'caption');
    balanceTitle.textContent = 'Укажите баланс';

    const balanceInput = document.createElement('input');
    balanceInput.name = 'start-balance';
    balanceInput.classList.add('input__input');
    balanceInput.placeholder = 'Стартовый баланс';

    balanceInput.addEventListener('input', onlyNumbersFormatter);
    balanceInput.addEventListener('change', currencyFormatterEvent);

    balanceLabel.append(balanceTitle, balanceInput);

    const dateSelector = new DateSelector();
    const calendarObj = new Calendar(
        {
            name: 'term',
            title: 'На срок',
            placeholder: 'Выбор даты',
            showCustomDateSelector: false,
        },
        dateSelector
    );

    const calcButton = document.createElement('button');
    calcButton.classList.add('btn', 'btn--primary');
    calcButton.textContent = 'Рассчитать';
    calcButton.type = 'submit';

    form.append(balanceLabel, calendarObj.getNode(), calcButton);
    body.appendChild(form);

    cardBlock.append(title, body);
    main.appendChild(cardBlock);
    page.appendChild(main);

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const startBalance: Element | RadioNodeList | null = form.elements.namedItem('start-balance');
        const term: Element | RadioNodeList | null = form.elements.namedItem('term');

        if (!startBalance || !term) {
            return;
        }

        if ('value' in startBalance && 'value' in term) {
            console.log(numberFormatter(startBalance.value), term.value);
        }
    });

    return {
        node: page,
        destroy: () => {
            balanceInput.removeEventListener('input', onlyNumbersFormatter);
            balanceInput.removeEventListener('change', currencyFormatterEvent);

            dateSelector.destroy();
            calendarObj.destroy();
        },
    };
};
