export interface IApp {
    start(): Promise<void>;
    destroy(): void;
}

export interface IAppStore {
    init(): Promise<void>;
    isWelcomeCompleted(): boolean;
    completeWelcome(): void;
}

export interface IRouter {
    go(name: string): Promise<void>;
    destroy(): void;
}

/**
 * Унифицированный контракт экрана
 */
export interface IScreen {
    enter(): void | Promise<void>;
    leave(): void;
}
