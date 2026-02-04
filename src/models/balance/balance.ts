import { IEvents } from '../../events/events.ts';
import { differentDateInDay, getCurrentDate } from '../../utils/date/dateUtils.ts';
import { saveBalanceDB } from '../../utils/db/balanceDB.ts';

import { IBalance, IBalanceModel } from './IBalance.ts';

export class BalanceModel implements IBalanceModel {
    private events: IEvents | undefined = undefined;
    private date: Date = getCurrentDate();
    private endDate: Date = getCurrentDate();
    private value: number = 0;
    private wasted: number = 0;
    private dayLimit: number = 0;
    private avgDayWasted: number = 0;

    constructor(events: IEvents) {
        this.events = events;
    }

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
        const endDate: Date = new Date(balance.endDate);
        const diffDays: number = differentDateInDay(this.date, endDate);

        this.endDate = endDate;
        this.value = balance.value;
        this.wasted = balance.wasted;
        this.dayLimit = balance.value / diffDays;
        this.avgDayWasted = balance.avgDayWasted;

        saveBalanceDB({
            id: this.date.toISOString(),
            endDate: this.endDate.toISOString(),
            value: this.value,
            wasted: this.wasted,
            dayLimit: this.dayLimit,
            avgDayWasted: this.avgDayWasted,
        }).catch((err) => {
            return new Error(`Error while creating balance: ${err}`);
        });
    }
}
