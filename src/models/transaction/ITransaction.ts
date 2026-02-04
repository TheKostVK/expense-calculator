export interface ITransaction {
    id: string;
    date: Date;
    value: number;
}

export interface ITransactionModel {
    createTransaction(transaction: ITransaction): Promise<ITransaction>;
    deleteTransaction(id: string): Promise<void>;
}
