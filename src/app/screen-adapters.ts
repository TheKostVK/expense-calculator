import { IBalancePresenter, IDayLimitPresenter, IWelcomePagePresenter } from '../presenters/types.ts';

import { IScreen } from './types.ts';

export class WelcomeScreen implements IScreen {
    constructor(private readonly presenter: IWelcomePagePresenter) {}

    enter(): void {
        this.presenter.init();
    }

    leave(): void {
        this.presenter.destroy();
    }
}

export class MainScreen implements IScreen {
    constructor(
        private readonly balancePresenter: IBalancePresenter,
        private readonly dayLimitPresenter: IDayLimitPresenter
    ) {}

    enter(): void {
        this.balancePresenter.init();
        this.dayLimitPresenter.init();
    }

    leave(): void {
        this.balancePresenter.destroy();
        this.dayLimitPresenter.destroy();
    }
}
