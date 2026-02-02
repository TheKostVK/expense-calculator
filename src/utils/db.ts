import { openDB, type DBSchema, type IDBPDatabase, type StoreKey, type StoreNames, type StoreValue } from 'idb';

/**
 * Колбэк для апгрейда схемы БД.
 * DB — схема IndexedDB (DBSchema).
 */
export type UpgradeCallback<DB extends DBSchema> = (
    db: IDBPDatabase<DB>,
    oldVersion: number,
    newVersion: number | null
) => void;

/**
 * Обёртка над `idb` с безопасными типами.
 *
 * @template DB - схема БД (DBSchema).
 */
export class IndexedDBService<DB extends DBSchema> {
    /**
     * Экземпляр открытой БД.
     * `null` возможен только до инициализации.
     */
    #db: IDBPDatabase<DB> | null = null;

    constructor(db: IDBPDatabase<DB>) {
        this.#db = db;
    }

    /**
     * Открывает БД и выполняет upgrade при необходимости.
     *
     * @param name - имя БД
     * @param version - версия схемы
     * @param onUpgrade - колбэк для миграций
     */
    static async open<DB extends DBSchema>(
        name: string,
        version: number,
        onUpgrade?: UpgradeCallback<DB>
    ): Promise<IndexedDBService<DB>> {
        if (!('indexedDB' in window)) {
            throw new Error('IndexedDB не поддерживается браузером');
        }

        const db = await openDB<DB>(name, version, {
            upgrade(db, oldVersion, newVersion) {
                onUpgrade?.(db, oldVersion, newVersion);
            },
        });

        return new IndexedDBService<DB>(db);
    }

    /**
     * Получить запись по ключу.
     *
     * @param storeName - имя хранилища
     * @param key - ключ записи
     */
    get<S extends StoreNames<DB>>(storeName: S, key: StoreKey<DB, S>): Promise<StoreValue<DB, S> | undefined> {
        this.#ensureDb();
        return this.#db!.get(storeName, key);
    }

    /**
     * Получить все записи из хранилища.
     *
     * @param storeName - имя хранилища
     */
    getAll<S extends StoreNames<DB>>(storeName: S): Promise<Array<StoreValue<DB, S>>> {
        this.#ensureDb();
        return this.#db!.getAll(storeName);
    }

    /**
     * Добавить или обновить запись.
     *
     * Если у objectStore задан `keyPath`, ключ можно не передавать.
     * Если `keyPath` нет — передай ключ параметром `key`.
     *
     * @param storeName - имя хранилища
     * @param value - сохраняемое значение
     * @param key - ключ (опционально)
     */
    put<S extends StoreNames<DB>>(
        storeName: S,
        value: StoreValue<DB, S>,
        key?: StoreKey<DB, S>
    ): Promise<StoreKey<DB, S>> {
        this.#ensureDb();
        return key !== undefined ? this.#db!.put(storeName, value, key) : this.#db!.put(storeName, value);
    }

    /**
     * Удалить запись по ключу.
     *
     * @param storeName - имя хранилища
     * @param key - ключ записи
     */
    delete<S extends StoreNames<DB>>(storeName: S, key: StoreKey<DB, S>): Promise<void> {
        this.#ensureDb();
        return this.#db!.delete(storeName, key);
    }

    /**
     * Очистить хранилище.
     *
     * @param storeName - имя хранилища
     */
    clear<S extends StoreNames<DB>>(storeName: S): Promise<void> {
        this.#ensureDb();
        return this.#db!.clear(storeName);
    }

    /**
     * Проверяет, что БД инициализирована.
     */
    #ensureDb(): void {
        if (!this.#db) {
            throw new Error('База данных не инициализирована');
        }
    }
}
