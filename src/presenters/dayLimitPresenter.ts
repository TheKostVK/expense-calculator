import { IEvents } from '../events/events.ts';
import { IBalance, IBalanceModel } from '../models/balance/IBalance.ts';
import { currencyFormatter, currencyFormatterEvent, onlyNumbersFormatter } from '../utils/formatters/inputFormatter.ts';
import { IMainView } from '../views/types.ts';

import { IDayLimitPresenter } from './types.ts';

export class DayLimitPresenter implements IDayLimitPresenter {
    private events: IEvents | undefined = undefined;
    private balanceModel: IBalanceModel | undefined = undefined;
    private view: IMainView | undefined = undefined;

    constructor(balanceModel: IBalanceModel, view: IMainView, events: IEvents) {
        this.balanceModel = balanceModel;
        this.view = view;
        this.events = events;
    }

    public init() {
        const balanceModel: IBalance = this.balanceModel!.getBalanceData();

        const cardBlock = document.createElement('div');
        cardBlock.classList.add('card-block');

        const cardDescription = document.createElement('div');
        cardDescription.classList.add('card__title');

        const cardDescSpan1 = document.createElement('h3');
        cardDescSpan1.classList.add('card__title-left');
        cardDescSpan1.textContent = 'На сегодня доступно';

        cardDescription.appendChild(cardDescSpan1);

        cardBlock.appendChild(cardDescription);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card__body');

        const balanceBlock = document.createElement('div');
        balanceBlock.classList.add('balance-block');

        const balanceBlockH1 = document.createElement('h1');
        balanceBlockH1.classList.add('balance-block__balance');

        const remainedBalanceDay = balanceModel.dayLimit - balanceModel.wasted;

        const balanceBlockSpan1 = document.createElement('span');
        balanceBlockSpan1.classList.add('balance-block__balance--remained');
        balanceBlockSpan1.textContent = currencyFormatter(remainedBalanceDay);

        const balanceBlockSpan2 = document.createElement('span');
        balanceBlockSpan2.classList.add('balance-block__balance--available');
        balanceBlockSpan2.textContent = currencyFormatter(balanceModel.dayLimit);

        balanceBlockH1.appendChild(balanceBlockSpan1);
        balanceBlockH1.appendChild(balanceBlockSpan2);

        balanceBlock.appendChild(balanceBlockH1);

        cardBody.appendChild(balanceBlock);

        const wastedComment = document.createElement('p');
        wastedComment.classList.add('balance-block__wasted-comment');
        wastedComment.textContent = ' 🎉 Отлично справились — сегодня вы в пределах лимита!';

        cardBody.appendChild(wastedComment);

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
        balanceInput.placeholder = '0 ₽';

        balanceInput.addEventListener('input', onlyNumbersFormatter);
        balanceInput.addEventListener('change', currencyFormatterEvent);

        balanceLabel.append(balanceTitle, balanceInput);

        const balanceChangeButton = document.createElement('button');
        balanceChangeButton.classList.add('btn', 'btn--primary', 'balance-block__change-button');
        balanceChangeButton.textContent = 'Сохранить';
        balanceChangeButton.type = 'submit';

        form.append(balanceLabel, balanceChangeButton);
        cardBody.appendChild(form);

        cardBlock.appendChild(cardBody);

        this.view!.addChild(cardBlock);

        this.destroyData = () => {
            this.view?.unmount();
        };
    }

    public destroy() {
        this.destroyData();
    }

    private destroyData: () => void = () => {};
}
