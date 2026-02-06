import { SYSTEM_EVENTS, SYSTEM_NAME_SPACE } from '../constant.ts';
import { IEvents } from '../events/events.ts';
import { IAccountModel } from '../models/account/IAccount.ts';
import { IBalance } from '../models/balance/IBalance.ts';
import { ITransaction } from '../models/transaction/ITransaction.ts';
import { dateFormatter, dateFullFormatter } from '../utils/formatters/dateFormatter.ts';
import { currencyFormatter } from '../utils/formatters/inputFormatter.ts';
import { IMainView } from '../views/types.ts';

import { ITransactionPresenter } from './types.ts';

export class TransactionPresenter implements ITransactionPresenter {
    private readonly events: IEvents;
    private readonly accountModel: IAccountModel;
    private readonly view: IMainView;
    private cardNode: HTMLElement | undefined = undefined;

    constructor(accountModel: IAccountModel, view: IMainView, events: IEvents) {
        this.accountModel = accountModel;
        this.view = view;
        this.events = events;

        this.events.on(SYSTEM_EVENTS.TRANSACTION_UPDATED, () => {
            this.transactionsListUpdated(false);
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

        cardBody.appendChild(transactionsList);

        const viewHistoryButton = document.createElement('button');
        viewHistoryButton.classList.add('btn');
        viewHistoryButton.textContent = 'Смотреть всю историю';

        cardBody.appendChild(viewHistoryButton);

        cardBlock.appendChild(cardBody);

        viewHistoryButton.addEventListener('click', this.handleViewFullHistory.bind(this));

        this.cardNode = cardBlock;

        this.transactionsListUpdated(false);

        this.view.addChildWithKey(SYSTEM_NAME_SPACE.TRANSACTION_BLOCK, cardBlock);

        this.destroyData = () => {
            viewHistoryButton.removeEventListener('click', this.handleViewFullHistory.bind(this));

            this.view.unmount(SYSTEM_NAME_SPACE.TRANSACTION_BLOCK);
        };
    }

    public destroy() {
        this.destroyData();
    }

    public initOverflow(): void {
        this.view.unmount(SYSTEM_NAME_SPACE.TRANSACTION_BLOCK);

        const balance: IBalance = this.accountModel.getBalance();

        const cardBlock = document.createElement('div');
        cardBlock.classList.add('card-block', 'card-block--overflow');

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
        transactionsList.classList.add('transactions-list', 'transactions-list--full');

        cardBody.appendChild(transactionsList);

        const moveToMainPageButton = document.createElement('button');
        moveToMainPageButton.classList.add('btn');
        moveToMainPageButton.textContent = 'Вернуться на главную';

        cardBody.appendChild(moveToMainPageButton);

        cardBlock.appendChild(cardBody);

        moveToMainPageButton.addEventListener('click', this.handelMoveToMainPage.bind(this));

        this.cardNode = cardBlock;

        this.transactionsListUpdated(true);

        this.view.addChildWithKey(SYSTEM_NAME_SPACE.TRANSACTION_BLOCK, cardBlock);

        this.destroyData = () => {
            moveToMainPageButton.removeEventListener('click', this.handelMoveToMainPage.bind(this));

            this.view.unmount(SYSTEM_NAME_SPACE.TRANSACTION_BLOCK);
        };
    }

    public overflowDestroy() {
        this.overflowDestroyData();
    }

    private handleViewFullHistory(event: Event) {
        event.preventDefault();

        this.events.emit(SYSTEM_EVENTS.CHANGE_PAGE, { page: SYSTEM_NAME_SPACE.TRANSACTION_PAGE });
    }

    private handelMoveToMainPage(event: Event) {
        event.preventDefault();

        this.events.emit(SYSTEM_EVENTS.CHANGE_PAGE, { page: SYSTEM_NAME_SPACE.MAIN_PAGE });
    }

    private transactionsListUpdated(fullLoad: boolean) {
        if (!this.cardNode) {
            throw new Error('Card node is not defined');
        }

        const transactionsListNode = this.cardNode.querySelector('.transactions-list');

        if (!transactionsListNode) {
            throw new Error('Transactions list node is not defined');
        }

        transactionsListNode.replaceChildren();

        let transactions: ITransaction[] = this.accountModel.getTransactions();

        if (!fullLoad) {
            transactions = transactions.slice(0, 3);
        }

        transactions.forEach((transaction) => {
            const transactionCard = document.createElement('div');
            transactionCard.classList.add('transaction-card');

            const transactionCardTitle = document.createElement('h3');
            transactionCardTitle.classList.add('transaction-card__value');
            transactionCardTitle.textContent = currencyFormatter(transaction.value);

            const transactionCardValue = document.createElement('span');
            transactionCardValue.classList.add('transaction-card__date');

            if (fullLoad) {
                transactionCardValue.textContent = dateFullFormatter(new Date(transaction.date));
            } else {
                transactionCardValue.textContent = dateFormatter(new Date(transaction.date));
            }

            transactionCard.appendChild(transactionCardTitle);
            transactionCard.appendChild(transactionCardValue);

            transactionsListNode.appendChild(transactionCard);
        });
    }

    private destroyData: () => void = () => {};
    private overflowDestroyData: () => void = () => {};
}
