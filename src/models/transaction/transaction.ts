import { ITransaction, ITransactionModel } from './ITransaction.ts';

export class TransactionModel implements ITransactionModel {
    private transactions: ITransaction[] = [];

    public setTransactions(transactions: ITransaction[]): void {
        this.transactions = transactions;
    }

    public getTransactions(): ITransaction[] {
        return this.transactions;
    }

    public getTransaction(id: string): ITransaction | undefined {
        return this.transactions.find((transaction) => transaction.id === id);
    }

    public getTransactionsCount(): number {
        return this.transactions.length;
    }

    public createTransaction(transaction: ITransaction): void {
        this.transactions.push(transaction);

        return;
    }

    public deleteTransaction(id: string): void {
        this.transactions = this.transactions.filter((transaction) => transaction.id !== id);

        return;
    }
}
