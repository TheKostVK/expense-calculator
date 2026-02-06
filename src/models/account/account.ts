import { SYSTEM_EVENTS } from '../../constant.ts';
import { IEvents } from '../../events/events.ts';
import { differentDateInDay, getCurrentDate } from '../../utils/date/dateUtils.ts';
import { saveBalance } from '../../utils/db/balanceDB.ts';
import { getTransaction, saveTransaction } from '../../utils/db/transactionDB.ts';
import { ITransactionCreate } from '../../utils/db/types.ts';
import { IBalance, IBalanceModel } from '../balance/IBalance.ts';
import { ITransaction, ITransactionModel } from '../transaction/ITransaction.ts';

import { IAccountModel, IBalanceLimit } from './IAccount.ts';

export class AccountModel implements IAccountModel {
    private readonly events: IEvents;
    private readonly balanceModel: IBalanceModel;
    private readonly transactionModel: ITransactionModel;

    constructor(events: IEvents, balanceModel: IBalanceModel, transactionModel: ITransactionModel) {
        this.events = events;
        this.balanceModel = balanceModel;
        this.transactionModel = transactionModel;
    }

    public getBalance(): IBalance {
        return this.balanceModel.getBalanceData();
    }

    public getBalanceLimit(): IBalanceLimit {
        const balance = this.balanceModel.getBalanceData();

        return {
            inLimit: balance.dayLimit - balance.wasted >= 0,
            remained: balance.dayLimit - balance.wasted,
            limit: balance.dayLimit,
            wasted: balance.wasted,
        };
    }

    public async upBalance(value: number, date: Date): Promise<void> {
        const currentBalance: IBalance = this.balanceModel.getBalanceData();
        const diffDays: number = differentDateInDay(getCurrentDate(), date);
        const newValue = currentBalance.value + value;

        const newBalance: IBalance = {
            id: currentBalance.id,
            endDate: date.toISOString(),
            value: newValue,
            wasted: currentBalance.wasted,
            dayLimit: newValue / diffDays,
            avgDayWasted: currentBalance.avgDayWasted,
        };

        await this.saveBalanceInDB(newBalance);

        this.balanceModel.updateBalance(newBalance);

        this.events.emit(SYSTEM_EVENTS.BALANCE_UPDATED);
    }

    public async initBalance(startBalance: number, endDate: Date): Promise<void> {
        const diffDays: number = differentDateInDay(getCurrentDate(), endDate);

        const newBalance: IBalance = {
            id: getCurrentDate().toISOString(),
            endDate: endDate.toISOString(),
            value: startBalance,
            wasted: 0,
            dayLimit: startBalance / diffDays,
            avgDayWasted: 0,
        };

        await this.saveBalanceInDB(newBalance);

        this.balanceModel.updateBalance(newBalance);
    }

    public async addTransaction(createDataTransaction: ITransactionCreate): Promise<void> {
        const transactionId: string = await this.saveTransactionInDB(createDataTransaction);
        const transaction: ITransaction | undefined = await this.getTransactionByIdInDB(transactionId);

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        this.transactionModel.createTransaction(transaction);
        this.events.emit(SYSTEM_EVENTS.TRANSACTION_UPDATED);

        await this.addWasted(transaction.value);
    }

    public getTransactions(): ITransaction[] {
        return this.transactionModel.getTransactions();
    }

    public getTransactionsCount(): number {
        return this.transactionModel.getTransactionsCount();
    }

    private async addWasted(wasted: number): Promise<void> {
        const balance = this.balanceModel.getBalanceData();
        const transactionsCount = this.transactionModel.getTransactionsCount();

        if (wasted > balance.value) {
            throw new Error('Wasted cannot be greater than value');
        }

        let newBalance = {
            ...balance,
            value: balance.value - wasted,
            wasted: balance.wasted + wasted,
            avgDayWasted: balance.wasted / transactionsCount,
        };

        if (balance.dayLimit - balance.wasted <= 0) {
            const diffDays: number = differentDateInDay(getCurrentDate(), new Date(newBalance.endDate));

            newBalance = {
                ...newBalance,
                dayLimit: newBalance.value / diffDays,
            };
        }

        await this.saveBalanceInDB(newBalance);

        this.balanceModel.updateBalance(newBalance);

        this.events.emit(SYSTEM_EVENTS.BALANCE_UPDATED);
    }

    private async saveBalanceInDB(balance: IBalance): Promise<IBalance> {
        return await saveBalance(balance);
    }

    private async saveTransactionInDB(transaction: ITransactionCreate): Promise<string> {
        return await saveTransaction(transaction);
    }

    private async getTransactionByIdInDB(transactionId: string): Promise<ITransaction | undefined> {
        return await getTransaction(transactionId);
    }
}
