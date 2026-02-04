import { LS_NAME_SPACE, SYSTEM_EVENTS } from '../constant.ts';
import { IEvents } from '../events/events.ts';
import { IBalance, IBalanceModel } from '../models/balance/IBalance.ts';
import { getCurrentDate } from '../utils/date/dateUtils.ts';
import { getAllBalancesDB, getBalanceDB, saveBalanceDB } from '../utils/db/balanceDB.ts';

import { IAppStore } from './types.ts';

export class AppStore implements IAppStore {
    private welcomeCompleted = false;

    constructor(
        private readonly balanceModel: IBalanceModel,
        private readonly events: IEvents
    ) {
        this.welcomeCompleted = localStorage.getItem(LS_NAME_SPACE.WELCOME_COMPLETED) === 'true';

        if (!this.welcomeCompleted) {
            this.events.on(SYSTEM_EVENTS.WELCOME_COMPLETED, () => {
                this.completeWelcome();
            });
        }
    }

    public isWelcomeCompleted(): boolean {
        return this.welcomeCompleted;
    }

    /**
     * Инициализация доменных данных приложения.
     */
    public async init(): Promise<void> {
        await this.initBalance();
    }

    /**
     * Отмечает онбординг завершённым и уведомляет систему.
     */
    public completeWelcome(): void {
        this.welcomeCompleted = true;
        localStorage.setItem(LS_NAME_SPACE.WELCOME_COMPLETED, 'true');
    }

    private async initBalance(): Promise<IBalance> {
        try {
            const balance: IBalance | undefined = await getBalanceDB(getCurrentDate().toISOString());

            if (!balance) {
                const balances: IBalance[] = await getAllBalancesDB();

                if (balances.length === 0) {
                    await saveBalanceDB(this.balanceModel.getBalanceData());

                    throw new Error('Balance not found');
                } else {
                    this.balanceModel.updateBalance(balances[balances.length - 1]);
                }
            } else {
                this.balanceModel.updateBalance(balance);
            }
        } catch (err) {
            console.log(err);
        }

        return this.balanceModel.getBalanceData();
    }
}
