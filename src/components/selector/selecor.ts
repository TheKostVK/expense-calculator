import { ISelector } from './ISelector.ts';

export class Selector implements ISelector {
    node: HTMLFieldSetElement | null = null;
    dropdown: HTMLDivElement | null = null;
    destroy: () => void = () => {};
    name: string = '';
    title: string = '';
    placeholder: string = '';
    options: { value: string; label: string }[] = [];

    constructor(data: ISelector) {
        this.name = data.name;
        this.title = data.title;
        this.placeholder = data.placeholder;
        this.options = data.options ?? [];

        /**
         * Обработка клика по пункту выпадающего меню
         */
        const onDropdownItemClick = (evt: MouseEvent) => {
            evt.stopPropagation();

            const target = evt.target as HTMLElement;
            const el = target.closest<HTMLElement>('[data-value]');

            if (!el) {
                return;
            }

            input.value = el.dataset.value ?? '';

            // Специальный пункт (например, "Своя дата")
            if (el.dataset.option === 'offOnDropdownClick') {
                return;
            }

            dropdown.classList.remove('dropdown_menu-visible');
        };

        /**
         * Открытие / закрытие выпадающего меню
         */
        const onButtonClick = (evt: Event) => {
            evt.stopPropagation();

            const target = evt.target as HTMLElement;

            // Игнорируем клики внутри dropdown
            if (dropdown.contains(target)) {
                return;
            }

            if (target === input || button.contains(target)) {
                if (!dropdown.classList.contains('dropdown_menu-visible')) {
                    this.openDropdown();
                } else {
                    this.closeDropdown();
                }
            }
        };

        /**
         * Закрытие меню по клику вне компонента
         */
        const onDocumentClick = (evt: MouseEvent) => {
            const target = evt.target as HTMLElement;

            if (!selector.contains(target)) {
                dropdown.classList.remove('dropdown_menu-visible');
            }
        };

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
        input.name = this.name;
        input.placeholder = this.placeholder;
        input.readOnly = true;

        /**
         * Кнопка открытия меню
         */
        const button = document.createElement('button');
        button.classList.add('selector__drop_button');
        button.type = 'button';

        const img = document.createElement('img');
        img.classList.add('selector__drop_button-img');
        img.src = 'src/assets/down.svg';
        img.alt = 'dropdown button';

        button.appendChild(img);

        /**
         * Выпадающее меню
         */
        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown_menu');

        selector.append(legend, input, button, dropdown);

        selector.addEventListener('click', onButtonClick);
        dropdown.addEventListener('click', onDropdownItemClick);
        document.addEventListener('click', onDocumentClick);

        this.node = selector;
        this.dropdown = dropdown;

        this.destroy = () => {
            selector.removeEventListener('click', onButtonClick);
            dropdown.removeEventListener('click', onDropdownItemClick);
            document.removeEventListener('click', onDocumentClick);
        };
    }

    /**
     * Получить DOM-узел селектора
     */
    getNode() {
        return {
            node: this.node || document.createElement('fieldset'),
            destroy: this.destroy,
        };
    }

    /**
     * Открыть выпадающее меню
     */
    openDropdown() {
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
    closeDropdown() {
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
}
