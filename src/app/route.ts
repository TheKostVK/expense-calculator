import { IRouter, IScreen } from './types.ts';

export class Router implements IRouter {
    private current: IScreen | null = null;

    constructor(private readonly screens: Record<string, IScreen>) {}

    /**
     * Переключает экран, гарантируя корректный leave() текущего.
     */
    public async go(name: string): Promise<void> {
        const next = this.screens[name];

        if (!next) {
            return;
        }

        if (this.current !== next) {
            this.current?.leave();
            this.current = next;
        }

        await next.enter(name);
    }

    public destroy(): void {
        this.current?.leave();
        this.current = null;
    }
}
