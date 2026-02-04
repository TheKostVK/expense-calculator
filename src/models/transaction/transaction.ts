import { IEvents } from '../../events/events.ts';

import { ITransaction, ITransactionModel } from './ITransaction.ts';

export class TransactionModel implements ITransactionModel {
    events: IEvents | undefined = undefined;

    constructor(events: IEvents) {
        this.events = events;
    }

    createTransaction(transaction: ITransaction): Promise<ITransaction> {
        return Promise.resolve(transaction);
    }

    deleteTransaction(id: string): Promise<void> {
        console.log(id);
        return Promise.resolve();
    }
}
