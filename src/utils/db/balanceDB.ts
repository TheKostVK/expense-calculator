import { nanoid } from 'nanoid';

import { balanceDBName, balanceDBVersion, balanceTableName } from '../../constant.ts';
import { BalanceId, IBalance } from '../../models/balance/IBalance.ts';

import { IndexedDBService } from './db.ts';
import { BalanceCreateInput, BalanceDB, SaveBalanceResult } from './types.ts';

/**
 * Открытие БД с типизированной схемой.
 */
export const balanceDBPromise = IndexedDBService.open<BalanceDB>(balanceDBName, balanceDBVersion, (db) => {
    if (!db.objectStoreNames.contains(balanceTableName)) {
        db.createObjectStore(balanceTableName, { keyPath: 'id' });
    }
});

/**
 * Создать или обновить баланс.
 */
export async function saveBalanceDB(record: BalanceCreateInput): Promise<SaveBalanceResult> {
    const db = await balanceDBPromise;

    const id = record.id ?? nanoid();
    const balance: IBalance = { ...record, id };

    await db.put(balanceTableName, balance);

    return balance;
}

/**
 * Получить баланс по id.
 */
export async function getBalanceDB(id: BalanceId): Promise<IBalance | undefined> {
    const db = await balanceDBPromise;
    return db.get(balanceTableName, id);
}

/**
 * Получить все балансы.
 */
export async function getAllBalancesDB(): Promise<IBalance[]> {
    const db = await balanceDBPromise;
    return db.getAll(balanceTableName);
}
