import { Calendar } from '../components/calendar/calendar.ts';
import { DateSelector } from '../components/calendar/dateSelector.ts';
import { SYSTEM_EVENTS, SYSTEM_NAME_SPACE } from '../constant.ts';
import { IEvents } from '../events/events.ts';
import { IAccountModel } from '../models/account/IAccount.ts';
import { IBalance } from '../models/balance/IBalance.ts';
import { differentDateInDay } from '../utils/date/dateUtils.ts';
import {
    currencyFormatter,
    currencyFormatterEvent,
    numberFormatter,
    onlyNumbersFormatter,
} from '../utils/formatters/inputFormatter.ts';
import { IMainView } from '../views/types.ts';

import { IBalancePresenter } from './types.ts';

export class BalancePresenter implements IBalancePresenter {
    private readonly events: IEvents;
    private readonly accountModel: IAccountModel;
    private readonly view: IMainView;
    private cardNode: HTMLElement | undefined = undefined;

    constructor(accountModel: IAccountModel, view: IMainView, events: IEvents) {
        this.accountModel = accountModel;
        this.view = view;
        this.events = events;

        this.events.on(SYSTEM_EVENTS.BALANCE_UPDATED, () => {
            this.balanceUpdate();
        });
    }

    public init() {
        const balance: IBalance = this.accountModel.getBalance();

        const cardBlock = document.createElement('div');
        cardBlock.classList.add('card-block');

        const cardDescription = document.createElement('div');
        cardDescription.classList.add('card__title');

        const cardDescSpan1 = document.createElement('h3');
        cardDescSpan1.classList.add('card__title-left');
        cardDescSpan1.textContent = 'Общий баланс';

        const cardDescSpan2 = document.createElement('span');
        cardDescSpan2.classList.add('card__title-right');
        cardDescSpan2.textContent = `${currencyFormatter(balance.dayLimit)} в день`;

        cardDescription.appendChild(cardDescSpan1);
        cardDescription.appendChild(cardDescSpan2);

        cardBlock.appendChild(cardDescription);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card__body');

        const balanceBlock = document.createElement('div');
        balanceBlock.classList.add('balance-block');

        const differentDayToEnd = differentDateInDay(new Date(balance.id), new Date(balance.endDate));

        const balanceBlockSpan1 = document.createElement('h1');
        balanceBlockSpan1.classList.add('balance-block__balance');
        balanceBlockSpan1.textContent = currencyFormatter(balance.value);

        const balanceBlockSpan2 = document.createElement('span');
        balanceBlockSpan2.classList.add('balance-block__day');
        balanceBlockSpan2.textContent = `на ${differentDayToEnd} дней`;

        balanceBlock.appendChild(balanceBlockSpan1);
        balanceBlock.appendChild(balanceBlockSpan2);

        cardBody.appendChild(balanceBlock);

        const balanceChangeButton = document.createElement('button');
        balanceChangeButton.classList.add('btn', 'balance-block__change-button');
        balanceChangeButton.textContent = 'Изменить';

        cardBody.appendChild(balanceChangeButton);

        cardBlock.appendChild(cardBody);

        balanceChangeButton.addEventListener('click', this.handleChangeBalance.bind(this));

        this.cardNode = cardBlock;
        this.view.addChildWithKey(SYSTEM_NAME_SPACE.BALANCE_BLOCK, cardBlock);

        this.destroyData = () => {
            this.cardNode?.classList.toggle('card-block--hidden');

            balanceChangeButton.removeEventListener('click', this.handleChangeBalance.bind(this));

            this.view.unmount(SYSTEM_NAME_SPACE.BALANCE_BLOCK);
        };
    }

    public destroy() {
        this.destroyData();
    }

    public initOverflow() {
        const balance: IBalance = this.accountModel.getBalance();

        const cardBlock = document.createElement('div');
        cardBlock.classList.add('card-block', 'card-block--overflow');

        const cardDescription = document.createElement('div');
        cardDescription.classList.add('card__title');

        const cardDescSpan1 = document.createElement('h3');
        cardDescSpan1.classList.add('card__title-left');
        cardDescSpan1.textContent = 'Общий баланс';

        const cardDescSpan2 = document.createElement('span');
        cardDescSpan2.classList.add('card__title-right');
        cardDescSpan2.textContent = `${currencyFormatter(balance.dayLimit)} в день`;

        cardDescription.appendChild(cardDescSpan1);
        cardDescription.appendChild(cardDescSpan2);

        cardBlock.appendChild(cardDescription);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card__body');

        const form = document.createElement('form');
        form.name = 'change-balance';
        form.classList.add('form', 'form--change-balance');

        /* label.input */
        const balanceLabel = document.createElement('label');
        balanceLabel.classList.add('input');

        const balanceTitle = document.createElement('span');
        balanceTitle.classList.add('input__title', 'caption');
        balanceTitle.textContent = 'Ваш баланс';

        const balanceInput = document.createElement('input');
        balanceInput.name = 'balance';
        balanceInput.classList.add('input__input');
        balanceInput.disabled = true;
        balanceInput.placeholder = 'Ваш баланс';
        balanceInput.value = currencyFormatter(balance.value);

        balanceLabel.append(balanceTitle, balanceInput);

        const upBalanceLabel = document.createElement('label');
        upBalanceLabel.classList.add('input');

        const upBalanceTitle = document.createElement('span');
        upBalanceTitle.classList.add('input__title', 'caption');
        upBalanceTitle.textContent = 'Пополнить';

        const upBalanceInput = document.createElement('input');
        upBalanceInput.name = 'up-balance';
        upBalanceInput.classList.add('input__input');
        upBalanceInput.placeholder = 'Пополнить';
        upBalanceInput.value = currencyFormatter(0);

        upBalanceInput.addEventListener('input', onlyNumbersFormatter);
        upBalanceInput.addEventListener('change', currencyFormatterEvent);

        upBalanceLabel.append(upBalanceTitle, upBalanceInput);

        const dateSelector = new DateSelector();
        const calendarObj = new Calendar(
            {
                name: 'term',
                title: 'На срок',
                placeholder: 'Выбор даты',
            },
            dateSelector
        );

        calendarObj.setValue(balance.endDate);

        const calcButton = document.createElement('button');
        calcButton.classList.add('btn', 'btn--primary', 'form__submit--change-balance');
        calcButton.textContent = 'сохранить';
        calcButton.type = 'submit';

        form.append(balanceLabel, upBalanceLabel, calendarObj.getNode(), calcButton);
        cardBody.appendChild(form);

        cardBlock.appendChild(cardBody);

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const upBalance: Element | RadioNodeList | null = form.elements.namedItem('up-balance');
            const term: Element | RadioNodeList | null = form.elements.namedItem('term');

            if (!upBalance || !term) {
                return;
            }

            if ('value' in upBalance && 'value' in term) {
                await this.accountModel.upBalance(numberFormatter(upBalance.value), new Date(term.value));
            }

            this.events.emit(SYSTEM_EVENTS.CHANGE_PAGE, { page: SYSTEM_NAME_SPACE.MAIN_PAGE });
        });

        this.view.addChildWithKey(SYSTEM_NAME_SPACE.BALANCE_PAGE, cardBlock);

        this.overflowDestroyData = () => {
            upBalanceInput.removeEventListener('input', onlyNumbersFormatter);
            upBalanceInput.removeEventListener('change', currencyFormatterEvent);

            this.view.unmount(SYSTEM_NAME_SPACE.BALANCE_PAGE);
        };
    }

    public overflowDestroy() {
        this.overflowDestroyData();
    }

    private handleChangeBalance(event: Event) {
        event.preventDefault();

        this.events.emit(SYSTEM_EVENTS.CHANGE_PAGE, { page: SYSTEM_NAME_SPACE.BALANCE_PAGE });
    }

    private balanceUpdate() {
        if (!this.cardNode) {
            throw new Error('Card node is not defined');
        }

        const balance: IBalance = this.accountModel.getBalance();

        const balanceNode = this.cardNode.querySelector('.card__title-left');
        const dayLimitNode = this.cardNode.querySelector('.card__title-right');

        if (!balanceNode || !dayLimitNode) {
            throw new Error('Balance/Day-limit node is not defined');
        }

        balanceNode.textContent = currencyFormatter(balance.value);
        dayLimitNode.textContent = currencyFormatter(balance.dayLimit);
    }

    private destroyData: () => void = () => {};
    private overflowDestroyData: () => void = () => {};
}
