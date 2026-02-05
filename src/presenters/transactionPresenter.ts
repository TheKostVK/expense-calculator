import { SYSTEM_EVENTS } from '../constant.ts';
import { IEvents } from '../events/events.ts';
import { IAccountModel } from '../models/account/IAccount.ts';
import { IBalance } from '../models/balance/IBalance.ts';
import { ITransaction } from '../models/transaction/ITransaction.ts';
import { dateFormatter } from '../utils/formatters/dateFormatter.ts';
import { currencyFormatter } from '../utils/formatters/inputFormatter.ts';
import { IMainView } from '../views/types.ts';

import { ITransactionPresenter } from './types.ts';

export class TransactionPresenter implements ITransactionPresenter {
    private readonly events: IEvents;
    private readonly accountModel: IAccountModel;
    private readonly view: IMainView;
    private transactionsListNode: HTMLElement | undefined = undefined;

    constructor(accountModel: IAccountModel, view: IMainView, events: IEvents) {
        this.accountModel = accountModel;
        this.view = view;
        this.events = events;

        this.events.on(SYSTEM_EVENTS.TRANSACTION_UPDATED, () => {
            this.transactionsListUpdated(this.transactionsListNode!);
        });
    }

    public init() {
        const balance: IBalance = this.accountModel.getBalance();

        const cardBlock = document.createElement('div');
        cardBlock.classList.add('card-block');

        const cardDescription = document.createElement('div');
        cardDescription.classList.add('card__title', 'card__title--wasted');

        const cardDescSpan = document.createElement('h2');
        cardDescSpan.classList.add('card__title-left');
        cardDescSpan.textContent = 'История расходов';

        cardDescription.appendChild(cardDescSpan);

        cardBlock.appendChild(cardDescription);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card__body');

        const cardAvgWastedSpan = document.createElement('span');
        cardAvgWastedSpan.classList.add('card__body__title');
        cardAvgWastedSpan.textContent = `Средние траты в день: ${currencyFormatter(balance.avgDayWasted)}`;

        cardBody.appendChild(cardAvgWastedSpan);

        const transactionsList = document.createElement('div');
        transactionsList.classList.add('transactions-list');

        this.transactionsListUpdated(transactionsList);

        this.transactionsListNode = transactionsList;

        cardBody.appendChild(transactionsList);

        const viewHistoryButton = document.createElement('button');
        viewHistoryButton.classList.add('btn');
        viewHistoryButton.textContent = 'Смотреть всю историю';

        cardBody.appendChild(viewHistoryButton);

        cardBlock.appendChild(cardBody);

        this.view.addChild(cardBlock);

        this.destroyData = () => {
            this.view.unmount();
        };
    }

    public destroy() {
        this.destroyData();
    }

    private transactionsListUpdated(transactionsListNode: HTMLElement) {
        transactionsListNode.replaceChildren();

        const transactions: ITransaction[] = this.accountModel.getTransactions().slice(0, 3);

        transactions.forEach((transaction) => {
            const transactionCard = document.createElement('div');
            transactionCard.classList.add('transaction-card');

            const transactionCardTitle = document.createElement('h3');
            transactionCardTitle.classList.add('transaction-card__value');
            transactionCardTitle.textContent = currencyFormatter(transaction.value);

            const transactionCardValue = document.createElement('span');
            transactionCardValue.classList.add('transaction-card__date');
            transactionCardValue.textContent = dateFormatter(new Date(transaction.date));

            transactionCard.appendChild(transactionCardTitle);
            transactionCard.appendChild(transactionCardValue);

            transactionsListNode.appendChild(transactionCard);
        });
    }

    private destroyData: () => void = () => {};
}
