import { TransactionId } from '../../utils/db/types.ts';

export interface ITransaction {
    id: TransactionId;
    date: string;
    value: number;
}

export interface ITransactionModel {
    setTransactions(transactions: ITransaction[]): void;
    getTransactions(): ITransaction[];
    getTransaction(id: string): ITransaction | undefined;
    getTransactionsCount(): number;
    createTransaction(transaction: ITransaction): void;
    deleteTransaction(id: string): void;
}
