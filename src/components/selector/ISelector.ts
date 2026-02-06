export interface ISelector {
    name: string;
    title: string;
    placeholder: string;
    options?: {
        value: string;
        label: string;
    }[];
}

export interface ISelectorClass {
    destroy(): void;
    getNode(): HTMLFieldSetElement;
}
