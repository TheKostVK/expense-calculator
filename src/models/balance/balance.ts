import { getCurrentDate } from '../../utils/date/dateUtils.ts';

import { IBalance, IBalanceModel } from './IBalance.ts';

export class BalanceModel implements IBalanceModel {
    private date: Date = getCurrentDate();
    private endDate: Date = getCurrentDate();
    private value: number = 0;
    private wasted: number = 0;
    private dayLimit: number = 0;
    private avgDayWasted: number = 0;

    public getBalanceData(): IBalance {
        return {
            id: this.date.toISOString(),
            endDate: this.endDate.toISOString(),
            value: this.value,
            wasted: this.wasted,
            dayLimit: this.dayLimit,
            avgDayWasted: this.avgDayWasted,
        };
    }

    public updateBalance(balance: IBalance) {
        this.endDate = new Date(balance.endDate);
        this.value = balance.value;
        this.wasted = balance.wasted;
        this.dayLimit = balance.dayLimit;
        this.avgDayWasted = balance.avgDayWasted;
    }
}
