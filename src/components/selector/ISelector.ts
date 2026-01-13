export interface IGetNodeSelector {
    name: string;
    title: string;
    placeholder: string;
    dropdownBody?: HTMLElement;
    options?: {
        value: string;
        label: string;
    }[];
}
