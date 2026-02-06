import { ITransactionCreate } from '../../utils/db/types.ts';
import { IBalance } from '../balance/IBalance.ts';
import { ITransaction } from '../transaction/ITransaction.ts';

export interface IBalanceLimit {
    inLimit: boolean;
    remained: number;
    limit: number;
    wasted: number;
}

export interface IAccountModel {
    initBalance(startBalance: number, endDate: Date): Promise<void>;
    upBalance(value: number, date: Date): Promise<void>;
    getBalance(): IBalance;
    getBalanceLimit(): IBalanceLimit;
    addTransaction(transaction: ITransactionCreate): Promise<void>;
    getTransactions(): ITransaction[];
    getTransactionsCount(): number;
}
