import { SYSTEM_EVENTS, SYSTEM_NAME_SPACE } from '../constant.ts';
import { IEvents } from '../events/events.ts';
import { IAccountModel, IBalanceLimit } from '../models/account/IAccount.ts';
import { IBalance } from '../models/balance/IBalance.ts';
import { getCurrentDate } from '../utils/date/dateUtils.ts';
import { ITransactionCreate } from '../utils/db/types.ts';
import {
    currencyFormatter,
    currencyFormatterEvent,
    numberFormatter,
    onlyNumbersFormatter,
} from '../utils/formatters/inputFormatter.ts';
import { IMainView } from '../views/types.ts';

import { IDayLimitPresenter } from './types.ts';

export class DayLimitPresenter implements IDayLimitPresenter {
    private readonly events: IEvents;
    private readonly accountModel: IAccountModel;
    private readonly view: IMainView;
    private wastedNode: HTMLElement | undefined = undefined;
    private commentBlock: HTMLElement | undefined = undefined;

    constructor(accountModel: IAccountModel, view: IMainView, events: IEvents) {
        this.accountModel = accountModel;
        this.view = view;
        this.events = events;

        this.events.on(SYSTEM_EVENTS.BALANCE_UPDATED, () => {
            this.balanceUpdate(this.wastedNode!);
            this.commentUpdate(this.commentBlock!);
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
        cardDescSpan1.textContent = 'На сегодня доступно';

        cardDescription.appendChild(cardDescSpan1);

        cardBlock.appendChild(cardDescription);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card__body');

        const balanceBlock = document.createElement('div');
        balanceBlock.classList.add('balance-block');

        const balanceBlockH1 = document.createElement('h1');
        balanceBlockH1.classList.add('balance-block__balance');

        const balanceBlockSpan1 = document.createElement('span');

        this.balanceUpdate(balanceBlockSpan1);

        const balanceBlockSpan2 = document.createElement('span');
        balanceBlockSpan2.classList.add('balance-block__balance--available');
        balanceBlockSpan2.textContent = currencyFormatter(balance.dayLimit);

        this.wastedNode = balanceBlockSpan1;
        balanceBlockH1.appendChild(balanceBlockSpan1);
        balanceBlockH1.appendChild(balanceBlockSpan2);

        balanceBlock.appendChild(balanceBlockH1);

        cardBody.appendChild(balanceBlock);

        const wastedComment = document.createElement('p');
        wastedComment.classList.add('balance-block__wasted-comment');

        this.commentBlock = wastedComment;
        this.commentUpdate(wastedComment);

        cardBody.appendChild(wastedComment);

        const form = document.createElement('form');
        form.name = 'welcome';
        form.classList.add('form', 'form--day-limit');

        /* label.input */
        const balanceLabel = document.createElement('label');
        balanceLabel.classList.add('input');

        const balanceTitle = document.createElement('span');
        balanceTitle.classList.add('input__title', 'caption');
        balanceTitle.textContent = 'Введите трату';

        const balanceInput = document.createElement('input');
        balanceInput.name = 'wasted';
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

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const wasted: Element | RadioNodeList | null = form.elements.namedItem('wasted');

            if (!wasted) {
                return;
            }

            if ('value' in wasted) {
                const newTransaction: ITransactionCreate = {
                    value: numberFormatter(wasted.value),
                    date: getCurrentDate().toISOString(),
                };

                await this.accountModel.addTransaction(newTransaction);

                balanceInput.value = '';
                balanceInput.placeholder = '0 ₽';
            }
        });

        this.view.addChildWithKey(SYSTEM_NAME_SPACE.DAY_LIMIT_BLOCK, cardBlock);

        this.destroyData = () => {
            this.view.unmount(SYSTEM_NAME_SPACE.DAY_LIMIT_BLOCK);

            balanceInput.removeEventListener('input', onlyNumbersFormatter);
            balanceInput.removeEventListener('change', currencyFormatterEvent);
        };
    }

    public destroy() {
        this.destroyData();
    }

    private balanceUpdate(node: HTMLElement): void {
        const remainedBalanceDay = this.accountModel.getRemainedBalanceDay();

        node.textContent = currencyFormatter(remainedBalanceDay);
        node.classList.remove();

        if (remainedBalanceDay >= 0) {
            node.classList.add('balance-block__balance--remained--success');
        } else {
            node.classList.add('balance-block__balance--remained--error');
        }
    }

    private commentUpdate(node: HTMLElement): void {
        const balanceLimit: IBalanceLimit = this.accountModel.getBalanceLimit();

        if (balanceLimit.inLimit) {
            node.textContent = '🎉 Отлично справились — сегодня вы в пределах лимита!';
        } else {
            node.textContent = '❌ Вы превысили лимит на сегодня!';
        }
    }

    private destroyData: () => void = () => {};
}
