import { ITransactionCreate } from '../../utils/db/types.ts';
import { IBalance } from '../balance/IBalance.ts';
import { ITransaction } from '../transaction/ITransaction.ts';

export interface IBalanceLimit {
    inLimit: boolean;
    limit: number;
    wasted: number;
}

export interface IAccountModel {
    initBalance(startBalance: number, endDate: Date): Promise<void>;
    getBalance(): IBalance;
    getRemainedBalanceDay(): number;
    getBalanceLimit(): IBalanceLimit;
    addTransaction(transaction: ITransactionCreate): Promise<void>;
    getTransactions(): ITransaction[];
    getTransactionsCount(): number;
}
