import { DBSchema } from 'idb';

import { balanceTableName, transactionTableName } from '../../constant.ts';
import { BalanceId, IBalance } from '../../models/balance/IBalance.ts';

/**
 * Входные данные для создания записи баланса.
 */
export type BalanceCreateInput = Omit<IBalance, 'id'> & { id?: BalanceId };

/**
 * Результат сохранения/обновления.
 */
export type SaveBalanceResult = IBalance;

/**
 * Схема IndexedDB.
 */
export interface BalanceDB extends DBSchema {
    [balanceTableName]: {
        key: BalanceId;
        value: IBalance;
        indexes: {
            by_date: BalanceId;
        };
    };
}

/**
 * ID сущности в IndexedDB.
 */
export type TransactionId = string;

/**
 * Модель транзакции, которая хранится в IndexedDB.
 */
export interface Transaction {
    id: TransactionId;
    date: Date;
    value: number;
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
