import { SYSTEM_EVENTS, SYSTEM_NAME_SPACE } from '../constant.ts';
import { IEvents } from '../events/events.ts';
import { IAccountModel } from '../models/account/IAccount.ts';
import { IBalance } from '../models/balance/IBalance.ts';
import { differentDateInDay } from '../utils/date/dateUtils.ts';
import { currencyFormatter } from '../utils/formatters/inputFormatter.ts';
import { IMainView } from '../views/types.ts';

import { IBalancePresenter } from './types.ts';

export class BalancePresenter implements IBalancePresenter {
    private readonly events: IEvents;
    private readonly accountModel: IAccountModel;
    private readonly view: IMainView;
    private balanceNode: HTMLElement | undefined = undefined;

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

        this.balanceNode = balanceBlockSpan1;
        balanceBlock.appendChild(balanceBlockSpan1);
        balanceBlock.appendChild(balanceBlockSpan2);

        cardBody.appendChild(balanceBlock);

        const balanceChangeButton = document.createElement('button');
        balanceChangeButton.classList.add('btn', 'balance-block__change-button');
        balanceChangeButton.textContent = 'Изменить';

        cardBody.appendChild(balanceChangeButton);

        cardBlock.appendChild(cardBody);

        balanceChangeButton.addEventListener('click', this.handleChangeBalance.bind(this));

        this.view.addChildWithKey(SYSTEM_NAME_SPACE.BALANCE_BLOCK, cardBlock);

        this.destroyData = () => {
            balanceChangeButton.removeEventListener('click', this.handleChangeBalance.bind(this));

            this.view.unmount(SYSTEM_NAME_SPACE.BALANCE_BLOCK);
        };
    }

    public destroy() {
        this.destroyData();
    }

    private handleChangeBalance(event: Event) {
        event.preventDefault();

        this.events.emit(SYSTEM_EVENTS.CHANGE_PAGE, { page: SYSTEM_NAME_SPACE.BALANCE_PAGE });
    }

    private balanceUpdate() {
        const balance: IBalance = this.accountModel.getBalance();

        this.balanceNode!.textContent = currencyFormatter(balance.value);
    }

    private destroyData: () => void = () => {};
}
