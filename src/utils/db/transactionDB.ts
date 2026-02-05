import { nanoid } from 'nanoid';

import { transactionDBName, transactionDBVersion, transactionTableName } from '../../constant.ts';
import { ITransaction } from '../../models/transaction/ITransaction.ts';

import { IndexedDBService } from './db.ts';
import { ITransactionCreate, SaveTransactionResult, TransactionDB, TransactionId } from './types.ts';

/**
 * Открытие БД с типизированной схемой.
 */
export const transactionDBPromise = IndexedDBService.open<TransactionDB>(
    transactionDBName,
    transactionDBVersion,
    (db) => {
        if (!db.objectStoreNames.contains(transactionTableName)) {
            db.createObjectStore(transactionTableName, { keyPath: 'id' });
        }
    }
);

/**
 * Создать или обновить транзакцию.
 */
export async function saveTransaction(transaction: ITransactionCreate): Promise<SaveTransactionResult> {
    const db = await transactionDBPromise;

    const id = nanoid();
    const record: ITransaction = { ...transaction, id };

    await db.put(transactionTableName, record);

    return id;
}

/**
 * Получить транзакцию по id.
 */
export async function getTransaction(id: TransactionId): Promise<ITransaction | undefined> {
    const db = await transactionDBPromise;
    return db.get(transactionTableName, id);
}

/**
 * Получить все транзакции.
 */
export async function getAllTransactions(): Promise<ITransaction[]> {
    const db = await transactionDBPromise;
    return db.getAll(transactionTableName);
}
