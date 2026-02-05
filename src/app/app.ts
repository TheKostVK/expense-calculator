import { SYSTEM_EVENTS, SYSTEM_NAME_SPACE } from '../constant.ts';
import { IEvents } from '../events/events.ts';

import { IApp, IAppStore, IRouter } from './types.ts';

export class App implements IApp {
    constructor(
        private readonly store: IAppStore,
        private readonly router: IRouter,
        private readonly events: IEvents
    ) {}

    /**
     * Точка входа: готовим данные и показываем стартовый экран
     */
    public async start(): Promise<void> {
        this.bindEvents();

        await this.store.init();

        await this.router.go(
            this.store.isWelcomeCompleted() ? SYSTEM_NAME_SPACE.MAIN_PAGE : SYSTEM_NAME_SPACE.WELCOME_PAGE
        );
    }

    public destroy(): void {
        this.router.destroy();
    }

    private bindEvents(): void {
        this.events.on(SYSTEM_EVENTS.INIT_BALANCE, async () => {
            await this.router.go(SYSTEM_NAME_SPACE.MAIN_PAGE);
        });

        this.events.on(SYSTEM_EVENTS.CHANGE_PAGE, async (page) => {
            if (typeof page !== 'string') {
                return;
            }

            await this.router.go(page);
        });
    }
}
