/**
 * Ключ дня в формате YYYY-MM-DD.
 */
export type BalanceId = string;

/**
 * Модель данных баланса, которая хранится в IndexedDB.
 */
export interface IBalance {
    id: BalanceId;
    endDate: string;
    value: number;
    wasted: number;
    dayLimit: number;
    avgDayWasted: number;
}

export interface IBalanceModel {
    getBalanceData(): IBalance;
    updateBalance(balance: IBalance): void;
}
