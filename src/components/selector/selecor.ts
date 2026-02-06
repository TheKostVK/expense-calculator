import downSvg from '@/assets/down.svg';

import { ISelector, ISelectorClass } from './ISelector.ts';

export class Selector implements ISelectorClass {
    protected hiddenInput: HTMLInputElement | undefined = undefined;
    protected selector: HTMLFieldSetElement | undefined = undefined;
    protected dropdown: HTMLDivElement | undefined = undefined;
    protected input: HTMLInputElement | undefined = undefined;
    protected button: HTMLButtonElement | undefined = undefined;
    protected name: string = '';
    protected title: string = '';
    protected placeholder: string = '';
    protected options: { value: string; label: string }[] = [];

    constructor(data: ISelector) {
        this.name = data.name;
        this.title = data.title;
        this.placeholder = data.placeholder;
        this.options = data.options ?? [];

        /**
         * Корневой контейнер селектора
         * fieldset — семантически корректная группа элементов формы
         */
        const selector = document.createElement('fieldset');
        selector.classList.add('selector');

        /**
         * Заголовок группы
         */
        const legend = document.createElement('legend');
        legend.classList.add('selector__title', 'caption');
        legend.textContent = this.title;

        /**
         * Инпут (read-only)
         */
        const input = document.createElement('input');
        input.classList.add('selector__input');
        input.placeholder = this.placeholder;
        input.name = 'input';
        input.readOnly = true;

        this.input = input;

        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = this.name;

        this.hiddenInput = hiddenInput;

        /**
         * Кнопка открытия меню
         */
        const button = document.createElement('button');
        button.classList.add('selector__drop_button');
        button.type = 'button';

        const img = document.createElement('img');
        img.classList.add('selector__drop_button-img');
        img.src = downSvg;
        img.alt = 'dropdown button';

        button.appendChild(img);

        this.button = button;

        /**
         * Выпадающее меню
         */
        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown_menu');

        selector.append(legend, input, hiddenInput, button, dropdown);

        this.selector = selector;
        this.dropdown = dropdown;

        this.selector.addEventListener('click', this.onButtonClick.bind(this));
        this.dropdown.addEventListener('click', this.onDropdownItemClick.bind(this));
        document.addEventListener('click', this.onDocumentClick.bind(this));
    }

    public destroy(): void {
        this.selector?.removeEventListener('click', this.onButtonClick.bind(this));
        this.dropdown?.removeEventListener('click', this.onDropdownItemClick.bind(this));

        document.removeEventListener('click', this.onDocumentClick.bind(this));
    }

    /**
     * Получить DOM-узел селектора
     */
    public getNode(): HTMLFieldSetElement {
        return this.selector || document.createElement('fieldset');
    }

    /**
     * Открыть выпадающее меню
     */
    protected openDropdown() {
        if (!this.dropdown) {
            return;
        }

        this.dropdown.replaceChildren();
        this.renderOptions(this.dropdown);
        this.dropdown.classList.add('dropdown_menu-visible');
    }

    /**
     * Закрыть выпадающее меню
     */
    protected closeDropdown() {
        if (!this.dropdown) {
            return;
        }

        this.dropdown.classList.remove('dropdown_menu-visible');
    }

    /**
     * Рендер стандартных опций
     */
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

    /**
     * Обработка клика по пункту выпадающего меню
     */
    private onDropdownItemClick = (evt: MouseEvent) => {
        evt.stopPropagation();

        const target = evt.target as HTMLElement;
        const el: HTMLButtonElement | null = target.closest<HTMLButtonElement>('[data-value]');

        if (!el || !this.input || !this.hiddenInput || !this.dropdown) {
            return;
        }

        this.input.value = el.dataset.value ?? '';

        this.hiddenInput.value = el.value ?? '';

        // Специальный пункт (например, "Своя дата")
        if (el.dataset.option === 'offOnDropdownClick') {
            return;
        }

        this.dropdown.classList.remove('dropdown_menu-visible');
    };

    /**
     * Открытие / закрытие выпадающего меню
     */
    private onButtonClick(evt: Event) {
        evt.stopPropagation();

        const target = evt.target as HTMLElement;

        // Игнорируем клики внутри dropdown
        if (!this.dropdown || !this.button || !this.input || this.dropdown.contains(target)) {
            return;
        }

        if (target === this.input || this.button.contains(target)) {
            if (!this.dropdown.classList.contains('dropdown_menu-visible')) {
                this.openDropdown();
            } else {
                this.closeDropdown();
            }
        }
    }

    /**
     * Закрытие меню по клику вне компонента
     */
    private onDocumentClick(evt: MouseEvent) {
        const target = evt.target as HTMLElement;

        if (!this.selector || !this.selector.contains(target)) {
            this.dropdown?.classList.remove('dropdown_menu-visible');
        }
    }
}
