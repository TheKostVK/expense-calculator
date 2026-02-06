import { LS_NAME_SPACE, SYSTEM_EVENTS } from '../constant.ts';
import { IEvents } from '../events/events.ts';
import { IBalance, IBalanceModel } from '../models/balance/IBalance.ts';
import { ITransaction, ITransactionModel } from '../models/transaction/ITransaction.ts';
import { getCurrentDate } from '../utils/date/dateUtils.ts';
import { getAllBalances, getBalance, saveBalance } from '../utils/db/balanceDB.ts';
import { getAllTransactions } from '../utils/db/transactionDB.ts';

import { IAppStore } from './types.ts';

export class AppStore implements IAppStore {
    private readonly events: IEvents;
    private readonly balanceModel: IBalanceModel;
    private readonly transactionModel: ITransactionModel;

    private initBalanceCompleted = false;

    constructor(events: IEvents, balanceModel: IBalanceModel, transactionModel: ITransactionModel) {
        this.events = events;
        this.balanceModel = balanceModel;
        this.transactionModel = transactionModel;
        this.initBalanceCompleted = localStorage.getItem(LS_NAME_SPACE.INIT_BALANCE) === 'true';

        if (!this.initBalanceCompleted) {
            this.events.on(SYSTEM_EVENTS.INIT_BALANCE, () => {
                this.completeWelcome();
            });
        }
    }

    public isWelcomeCompleted(): boolean {
        return this.initBalanceCompleted;
    }

    /**
     * Инициализация доменных данных приложения.
     */
    public async init(): Promise<void> {
        await this.initBalance();
        await this.initTransactions();
    }

    /**
     * Отмечает онбординг завершённым и уведомляет систему.
     */
    public completeWelcome(): void {
        this.initBalanceCompleted = true;
        localStorage.setItem(LS_NAME_SPACE.INIT_BALANCE, 'true');
    }

    private async initTransactions(): Promise<void> {
        try {
            const transactions: ITransaction[] = await getAllTransactions();

            this.transactionModel.setTransactions(transactions);
        } catch (err) {
            console.error(err);
        }

        return;
    }

    private async initBalance(): Promise<void> {
        try {
            const balance: IBalance | undefined = await getBalance(getCurrentDate().toISOString());

            if (!balance) {
                const balances: IBalance[] = await getAllBalances();

                if (balances.length === 0) {
                    await saveBalance(this.balanceModel.getBalanceData());
                } else {
                    const balance: IBalance = balances[balances.length - 1];
                    const newBalance: IBalance = {
                        ...balance,
                        id: getCurrentDate().toISOString(),
                        wasted: 0,
                    };

                    await saveBalance(newBalance);

                    this.balanceModel.updateBalance(newBalance);
                }
            } else {
                this.balanceModel.updateBalance(balance);
            }
        } catch (err) {
            console.error(err);
        }

        return;
    }
}
