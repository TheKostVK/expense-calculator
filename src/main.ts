import { App } from './app/app.ts';
import { AppStore } from './app/appStore.ts';
import { Router } from './app/route.ts';
import { MainScreen, WelcomeScreen } from './app/screen-adapters.ts';
import { IScreen } from './app/types.ts';
import { SYSTEM_NAME_SPACE } from './constant.ts';
import { EventEmitter } from './events/events.ts';
import { AccountModel } from './models/account/account.ts';
import { BalanceModel } from './models/balance/balance.ts';
import { TransactionModel } from './models/transaction/transaction.ts';
import { BalancePresenter } from './presenters/balancePresenter.ts';
import { DayLimitPresenter } from './presenters/dayLimitPresenter.ts';
import { TransactionPresenter } from './presenters/transactionPresenter.ts';
import { WelcomePagePresenter } from './presenters/welcomePagePresenter.ts';
import { transactionDBPromise } from './utils/db/transactionDB.ts';
import { MainView } from './views/mainView.ts';

/**
 * Инициализация приложения (Composition Root).
 * - Дожидается готовности IndexedDB
 * - Создаёт зависимости (Events, Models, View, Presenters)
 * - Собирает Screens/Router/App и запускает приложение
 */
export async function initApp(): Promise<void> {
    await transactionDBPromise;

    // Базовые зависимости
    const events = new EventEmitter();

    // Models
    const balanceModel = new BalanceModel();
    const transactionModel = new TransactionModel();
    const accountModel = new AccountModel(events, balanceModel, transactionModel);

    // Root View
    const mainView = new MainView();

    // Presenters
    const welcomePagePresenter = new WelcomePagePresenter(accountModel, mainView, events);
    const balancePresenter = new BalancePresenter(accountModel, mainView, events);
    const dayLimitPresenter = new DayLimitPresenter(accountModel, mainView, events);
    const transactionPresenter = new TransactionPresenter(accountModel, mainView, events);

    // Screens
    const screens: Record<string, IScreen> = {
        [SYSTEM_NAME_SPACE.WELCOME_PAGE]: new WelcomeScreen(welcomePagePresenter),
        [SYSTEM_NAME_SPACE.MAIN_PAGE]: new MainScreen(balancePresenter, dayLimitPresenter, transactionPresenter),
    };

    // Router + Store + App
    const router = new Router(screens);
    const store = new AppStore(events, balanceModel, transactionModel);
    const app = new App(store, router, events);

    // Старт
    await app.start();
}

document.addEventListener('DOMContentLoaded', async () => {
    await initApp();
});
