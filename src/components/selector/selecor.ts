import { IGetNodeSelector } from './ISelector.ts';

/**
 * Функция для создания селектора
 * @param data {IGetNodeSelector} - данные селектора
 */
export const getNodeSelector = (data: IGetNodeSelector) => {
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
    title.textContent = data.title;

    const input = document.createElement('input');
    input.classList.add('selector__input');
    input.name = data.name;
    input.placeholder = data.placeholder;
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

    if (data.options) {
        data.options.forEach((opt, index) => {
            const item = document.createElement('button');

            item.type = 'button';
            item.classList.add('dropdown_menu--item');
            item.dataset.value = opt.value;
            item.textContent = opt.label;

            dropdown.appendChild(item);

            if (data.options && data.options.length - 1 !== index) {
                const hr = document.createElement('hr');
                hr.classList.add('dropdown_menu--hr');

                dropdown.appendChild(hr);
            }
        });
    } else if (data.dropdownBody) {
        dropdown.appendChild(data.dropdownBody);
    } else {
        dropdown.textContent = 'No options';
    }

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
