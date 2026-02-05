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
    BALANCE_PAGE: 'BALANCE_PAGE',
    TRANSACTION_PAGE: 'TRANSACTION_PAGE',
    HISTORY_TRANSACTION_PAGE: 'HISTORY_TRANSACTION_PAGE',
    BALANCE_BLOCK: 'BALANCE_BLOCK',
    DAY_LIMIT_BLOCK: 'DAY_LIMIT_BLOCK',
    TRANSACTION_BLOCK: 'TRANSACTION_BLOCK',
} as const;

export const SYSTEM_EVENTS = {
    CHANGE_PAGE: 'CHANGE_PAGE',
    INIT_BALANCE: 'INIT_BALANCE',
    BALANCE_UPDATED: 'BALANCE_UPDATED',
    TRANSACTION_UPDATED: 'TRANSACTION_UPDATED',
} as const;

export const LS_NAME_SPACE = {
    INIT_BALANCE: 'INIT_BALANCE',
    BALANCE: 'BALANCE',
} as const;
