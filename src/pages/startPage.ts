import { getNodeSelector } from '../components/selector/selecor.ts';

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

    balanceLabel.append(balanceTitle, balanceInput);

    const selectorLabel = getNodeSelector({
        name: 'term',
        title: 'На срок',
        placeholder: 'Выбор даты',
        options: [
            {
                value: '1',
                label: '1 месяц',
            },
            {
                value: '3',
                label: '3 месяца',
            },
        ],
    });

    form.append(balanceLabel, selectorLabel.node);
    body.appendChild(form);

    const calcButton = document.createElement('button');
    calcButton.classList.add('btn', 'btn--primary');
    calcButton.textContent = 'Рассчитать';

    cardBlock.append(title, body, calcButton);
    main.appendChild(cardBlock);
    page.appendChild(main);

    return page;
};
