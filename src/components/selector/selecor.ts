import { ISelector } from './ISelector.ts';

export class Selector implements ISelector {
    name: string = '';
    title: string = '';
    placeholder: string = '';
    options: { value: string; label: string }[] = [];

    constructor(data: ISelector) {
        this.name = data.name;
        this.title = data.title;
        this.placeholder = data.placeholder;
        this.options = data.options ?? [];
    }

    /**
     * Функция для создания селектора
     */
    getNode = () => {
        /** Обработка клика по опции селектора */
        const onDropdownClick = (evt: MouseEvent) => {
            const target = evt.target as HTMLElement;
            const item = target.closest('.dropdown_menu--item') as HTMLButtonElement | null;

            if (!item) {
                return;
            }

            input.value = item.dataset.value ?? '';

            input.classList.add('selected_option');
            dropdown.classList.remove('dropdown_menu-visible');

            evt.stopPropagation();
        };

        /** Открытие/закрытие меню */
        const onButtonClick = (evt: Event) => {
            evt.stopPropagation();

            dropdown.classList.toggle('dropdown_menu-visible');
        };

        /** Закрытие по клику вне компонента */
        const onDocumentClick = (evt: MouseEvent) => {
            const target = evt.target as HTMLElement;

            if (!selector.contains(target)) {
                dropdown.classList.remove('dropdown_menu-visible');
            }
        };

        const selector = document.createElement('label');
        selector.classList.add('selector');

        const title = document.createElement('span');
        title.classList.add('selector__title', 'caption');
        title.textContent = this.title;

        const input = document.createElement('input');
        input.classList.add('selector__input');
        input.name = this.name;
        input.placeholder = this.placeholder;
        input.readOnly = true;

        const button = document.createElement('button');
        button.classList.add('selector__drop_button');
        button.type = 'button';

        const img = document.createElement('img');
        img.src = 'src/assets/down.svg';
        img.alt = 'dropdown button';

        button.appendChild(img);

        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown_menu');

        this.renderOptions(dropdown);

        selector.append(title, input, button, dropdown);

        input.addEventListener('click', onButtonClick);
        button.addEventListener('click', onButtonClick);
        dropdown.addEventListener('click', onDropdownClick);
        document.addEventListener('click', onDocumentClick);

        return {
            node: selector,

            destroy() {
                input.removeEventListener('click', onButtonClick);
                button.removeEventListener('click', onButtonClick);
                dropdown.removeEventListener('click', onDropdownClick);
                document.removeEventListener('click', onDocumentClick);
            },
        };
    };

    protected renderOptions(dropdown: HTMLDivElement) {
        this.options.forEach((opt) => {
            const item = document.createElement('button');

            item.type = 'button';
            item.classList.add('dropdown_menu--item');
            item.dataset.value = opt.value;
            item.textContent = opt.label;

            dropdown.appendChild(item);
        });
    }
}
