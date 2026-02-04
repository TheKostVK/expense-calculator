import { Calendar } from '../components/calendar/calendar.ts';
import { DateSelector } from '../components/calendar/dateSelector.ts';
import { SYSTEM_EVENTS } from '../constant.ts';
import { IEvents } from '../events/events.ts';
import { IBalance, IBalanceModel } from '../models/balance/IBalance.ts';
import { getCurrentDate } from '../utils/date/dateUtils.ts';
import { currencyFormatterEvent, numberFormatter, onlyNumbersFormatter } from '../utils/formatters/inputFormatter.ts';
import { IMainView } from '../views/types.ts';

import { IWelcomePagePresenter } from './types.ts';

export class WelcomePagePresenter implements IWelcomePagePresenter {
    private events: IEvents | undefined = undefined;
    private balanceModel: IBalanceModel | undefined = undefined;
    private view: IMainView | undefined = undefined;

    constructor(balanceModel: IBalanceModel, view: IMainView, events: IEvents) {
        this.balanceModel = balanceModel;
        this.view = view;
        this.events = events;
    }

    init() {
        const cardBlock = document.createElement('div');
        cardBlock.classList.add('card-block', 'card-block--welcome');

        const title = document.createElement('h1');
        title.classList.add('card__title');
        title.textContent = 'Начнём!';

        const body = document.createElement('div');
        body.classList.add('card__body');

        const form = document.createElement('form');
        form.name = 'welcome';
        form.classList.add('form', 'form--welcome');

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
        calcButton.classList.add('btn', 'btn--primary', 'form__submit--welcome');
        calcButton.textContent = 'Рассчитать';
        calcButton.type = 'submit';

        form.append(balanceLabel, calendarObj.getNode(), calcButton);
        body.appendChild(form);

        cardBlock.append(title, body);

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const startBalance: Element | RadioNodeList | null = form.elements.namedItem('start-balance');
            const term: Element | RadioNodeList | null = form.elements.namedItem('term');

            if (!startBalance || !term) {
                return;
            }

            if ('value' in startBalance && 'value' in term) {
                const newBalance: IBalance = {
                    id: getCurrentDate().toISOString(),
                    endDate: term.value,
                    value: numberFormatter(startBalance.value),
                    wasted: 0,
                    dayLimit: 0,
                    avgDayWasted: 0,
                };

                this.balanceModel?.updateBalance(newBalance);

                this.events?.emit(SYSTEM_EVENTS.WELCOME_COMPLETED);
            }
        });

        this.view!.update(cardBlock);

        this.destroyData = () => {
            balanceInput.removeEventListener('input', onlyNumbersFormatter);
            balanceInput.removeEventListener('change', currencyFormatterEvent);

            dateSelector.destroy();
            calendarObj.destroy();

            this.view?.unmount();
        };
    }

    destroy() {
        this.destroyData();
    }

    private destroyData: () => void = () => {};
}
