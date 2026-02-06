export interface IDateSelector {
    setDefaultValue(value: Date | string): void;
    getNode(): HTMLElement;
    destroy(): void;
}
