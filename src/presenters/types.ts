export interface IWelcomePagePresenter {
    init(): void;
    destroy(): void;
}

export interface IBalancePresenter {
    init(): void;
    destroy(): void;
    initOverflow(): void;
    overflowDestroy(): void;
}

export interface IDayLimitPresenter {
    init(): void;
    destroy(): void;
}

export interface ITransactionPresenter {
    init(): void;
    destroy(): void;
    initOverflow(): void;
    overflowDestroy(): void;
}
