import { IEvents } from '../events/events.ts';
import { IBalance, IBalanceModel } from '../models/balance/IBalance.ts';
import { differentDateInDay } from '../utils/date/dateUtils.ts';
import { currencyFormatter } from '../utils/formatters/inputFormatter.ts';
import { IMainView } from '../views/types.ts';

import { IBalancePresenter } from './types.ts';

export class BalancePresenter implements IBalancePresenter {
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
        cardDescSpan1.textContent = 'Общий баланс';

        const cardDescSpan2 = document.createElement('span');
        cardDescSpan2.classList.add('card__title-right');
        cardDescSpan2.textContent = `${currencyFormatter(balanceModel.dayLimit)} в день`;

        cardDescription.appendChild(cardDescSpan1);
        cardDescription.appendChild(cardDescSpan2);

        cardBlock.appendChild(cardDescription);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card__body');

        const balanceBlock = document.createElement('div');
        balanceBlock.classList.add('balance-block');

        const differentDayToEnd = differentDateInDay(new Date(balanceModel.id), new Date(balanceModel.endDate));

        const balanceBlockSpan1 = document.createElement('h1');
        balanceBlockSpan1.classList.add('balance-block__balance');
        balanceBlockSpan1.textContent = currencyFormatter(balanceModel.value);

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
