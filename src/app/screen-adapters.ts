import {
    IBalancePresenter,
    IDayLimitPresenter,
    ITransactionPresenter,
    IWelcomePagePresenter,
} from '../presenters/types.ts';

import { IScreen } from './types.ts';

export class WelcomeScreen implements IScreen {
    private readonly welcomePagePresenter: IWelcomePagePresenter;

    constructor(welcomePagePresenter: IWelcomePagePresenter) {
        this.welcomePagePresenter = welcomePagePresenter;
    }

    enter(): void {
        this.welcomePagePresenter.init();
    }

    leave(): void {
        this.welcomePagePresenter.destroy();
    }
}

export class MainScreen implements IScreen {
    constructor(
        private readonly balancePresenter: IBalancePresenter,
        private readonly dayLimitPresenter: IDayLimitPresenter,
        private readonly transactionPresenter: ITransactionPresenter
    ) {}

    enter(): void {
        this.balancePresenter.init();
        this.dayLimitPresenter.init();
        this.transactionPresenter.init();
    }

    leave(): void {
        this.balancePresenter.destroy();
        this.dayLimitPresenter.destroy();
        this.transactionPresenter.destroy();
    }
}
