import { nanoid } from 'nanoid';

import { transactionDBName, transactionDBVersion, transactionTableName } from '../constant.ts';

import { IndexedDBService } from './db';

import type { DBSchema } from 'idb';

/**
 * ID сущности в IndexedDB.
 */
export type TransactionId = string;

/**
 * Модель транзакции, которая хранится в IndexedDB.
 */
export interface Transaction {
    id: TransactionId;
    [key: string]: unknown;
}

/**
 * Входные данные для создания транзакции.
 * id можно не передавать — он будет сгенерирован.
 */
export type TransactionCreateInput = Omit<Transaction, 'id'> & { id?: TransactionId };

/**
 * Результат сохранения/обновления.
 */
export type SaveTransactionResult = TransactionId;

/**
 * Схема IndexedDB.
 * Ключ — строго `transactionTableName`, а не `string`.
 */
export interface TransactionDB extends DBSchema {
    [transactionTableName]: {
        key: TransactionId;
        value: Transaction;
    };
}

/**
 * Открытие БД с типизированной схемой.
 */
export const dbPromise = IndexedDBService.open<TransactionDB>(transactionDBName, transactionDBVersion, (db) => {
    if (!db.objectStoreNames.contains(transactionTableName)) {
        db.createObjectStore(transactionTableName, { keyPath: 'id' });
    }
});

/**
 * Создать или обновить транзакцию.
 */
export async function saveTransaction(transaction: TransactionCreateInput): Promise<SaveTransactionResult> {
    const db = await dbPromise;

    const id = transaction.id ?? nanoid();
    const record: Transaction = { ...transaction, id };

    await db.put(transactionTableName, record);

    return id;
}

/**
 * Получить транзакцию по id.
 */
export async function getTransaction(id: TransactionId): Promise<Transaction | undefined> {
    const db = await dbPromise;
    return db.get(transactionTableName, id);
}

/**
 * Получить все транзакции.
 */
export async function getAllTransactions(): Promise<Transaction[]> {
    const db = await dbPromise;
    return db.getAll(transactionTableName);
}
