export interface IMainView {
    update(children: HTMLElement): void;
    addChild(children: HTMLElement): void;
    mount(): void;
    unmount(): void;
}
