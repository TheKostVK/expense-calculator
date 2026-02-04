export const BASE_URL = import.meta.env.BASE_URL;

export const balanceDBVersion = 1 as const;
export const balanceDBName = 'balanceDB' as const;
export const balanceTableName = 'balance' as const;

export const transactionDBVersion = 1 as const;
export const transactionDBName = 'transactionDB' as const;
export const transactionTableName = 'transaction' as const;

export const SYSTEM_NAME_SPACE = {
    WELCOME_PAGE: 'WELCOME_PAGE',
    MAIN_PAGE: 'MAIN_PAGE',
    OVERALL_BALANCE_PAGE: 'OVERALL_BALANCE_PAGE',
    HISTORY_TRANSACTION_PAGE: 'HISTORY_TRANSACTION_PAGE',
    BALANCE_BLOCK: 'BALANCE_BLOCK',
    OVERALL_BALANCE_BLOCK: 'OVERALL_BALANCE_BLOCK',
    TRANSACTION_BLOCK: 'TRANSACTION_BLOCK',
} as const;

export const SYSTEM_EVENTS = {
    CHANGE_PAGE: 'CHANGE_PAGE',
    WELCOME_COMPLETED: 'WELCOME_COMPLETED',
    BALANCE_CHANGED: 'BALANCE_CHANGED',
} as const;

export const LS_NAME_SPACE = {
    WELCOME_COMPLETED: 'WELCOME_COMPLETED',
    BALANCE: 'BALANCE',
} as const;
