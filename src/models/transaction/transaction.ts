import { ITransaction, ITransactionModel } from './ITransaction.ts';

export class TransactionModel implements ITransactionModel {
    private transactions: ITransaction[] = [];

    /**
     * Устанавливает список транзакций извне
     * и сортирует их по дате (новые сверху)
     */
    public setTransactions(transactions: ITransaction[]): void {
        this.transactions = [...transactions].sort(this.sortByDateDesc);
    }

    /**
     * Возвращает отсортированный список транзакций
     */
    public getTransactions(): ITransaction[] {
        return this.transactions;
    }

    public getTransaction(id: string): ITransaction | undefined {
        return this.transactions.find((transaction) => transaction.id === id);
    }

    public getTransactionsCount(): number {
        return this.transactions.length;
    }

    /**
     * Создаёт новую транзакцию и добавляет её вверх списка
     */
    public createTransaction(transaction: ITransaction): void {
        this.transactions.unshift(transaction);
    }

    public deleteTransaction(id: string): void {
        this.transactions = this.transactions.filter((transaction) => transaction.id !== id);
    }

    /**
     * Сортировка по дате: от новых к старым
     */
    private sortByDateDesc(a: ITransaction, b: ITransaction): number {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
}
