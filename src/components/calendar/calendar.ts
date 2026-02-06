import {
    getLastDayOfCurrentMonth,
    getNextDay,
    getNextMonth,
    getNextTwoWeek,
    getNextWeek,
} from '../../utils/date/dateUtils.ts';
import { dateFormatter } from '../../utils/formatters/dateFormatter.ts';
import { Selector } from '../selector/selecor.ts';

import { ICalendar, ICalendarClass } from './ICalendar.ts';
import { IDateSelector } from './IDateSelector.ts';

export class Calendar extends Selector implements ICalendarClass {
    private readonly dateSelector: IDateSelector | null = null;

    private baseOptions = {
        nextDay: { value: getNextDay(), label: 'День' },
        nextWeek: { value: getNextWeek(), label: 'Неделя' },
        nextTwoWeek: { value: getNextTwoWeek(), label: 'Две недели' },
        nextMonth: { value: getNextMonth(), label: 'Месяц' },
        lastDayOfMonth: { value: getLastDayOfCurrentMonth(), label: 'До конца месяца' },
    };

    constructor(data: ICalendar, dateSelector: IDateSelector) {
        super(data);
        this.dateSelector = dateSelector;
    }

    /**
     * Установить значение календаря извне.
     *
     * - Принимает Date или ISO-строку.
     * - Обновляет значение инпута селектора (отображаемое значение).
     * - Прокидывает дату в DateSelector через setDefaultValue(),
     *   чтобы кастомный календарь показывал корректный месяц/день.
     *
     * @param value Дата (Date | ISO string)
     * @param label Необязательный текст для инпута. Если не передан — будет "до {date}"
     */
    public setValue(value: Date | string, label?: string): void {
        const parsed = typeof value === 'string' ? new Date(value) : new Date(value);

        if (Number.isNaN(parsed.getTime())) {
            return;
        }

        parsed.setHours(23, 59, 59, 999);

        this.dateSelector?.setDefaultValue(parsed);

        if (this.input && this.hiddenInput) {
            this.input.value = label ?? `до ${dateFormatter(parsed)}`;

            this.hiddenInput.value = parsed.toISOString() ?? '';
        }
    }

    override openDropdown() {
        super.openDropdown();

        if (!this.dropdown) {
            return;
        }

        this.dropdown.addEventListener('click', this.onDropdownCalendarClick.bind(this));
    }

    override closeDropdown() {
        super.closeDropdown();

        if (!this.dropdown) {
            return;
        }

        this.dropdown.removeEventListener('click', this.onDropdownCalendarClick.bind(this));
    }

    protected renderCalendar(dropdown: HTMLDivElement) {
        if (!this.dateSelector) {
            return;
        }

        dropdown.replaceChildren();

        const calendar = this.dateSelector.getNode();

        dropdown.appendChild(calendar);
    }

    protected override renderOptions(dropdown: HTMLDivElement) {
        dropdown.replaceChildren();

        const getMenuItem = () => {
            const item = document.createElement('button');
            const span1 = document.createElement('span');
            const span2 = document.createElement('span');

            item.type = 'button';
            item.classList.add('dropdown_menu--item');

            return { item, span1, span2 };
        };

        Object.entries(this.baseOptions).forEach(([key, option]) => {
            const { item, span1, span2 } = getMenuItem();

            span1.textContent = option.label;
            span2.textContent = `до ${dateFormatter(option.value)}`;

            option.value.setHours(23, 59, 59, 999);

            item.value = option.value.toISOString().toString();
            item.dataset.key = key;
            item.dataset.value = `${option.label} (до ${dateFormatter(option.value)})`;

            item.append(span1, span2);
            dropdown.appendChild(item);
        });

        // "Своя дата"
        const { item, span1, span2 } = getMenuItem();
        span1.textContent = 'Своя дата';

        item.value = 'customDate';
        item.dataset.key = 'customDate';
        item.dataset.value = 'Своя дата';
        item.dataset.option = 'offOnDropdownClick';

        item.append(span1, span2);
        dropdown.appendChild(item);
    }

    /**
     * Стабильный listener
     */
    private onDropdownCalendarClick = (evt: MouseEvent) => {
        evt.stopPropagation();

        if (!this.dropdown) {
            return;
        }

        const target = evt.target as HTMLElement;
        const item = target.closest<HTMLButtonElement>('.dropdown_menu--item');

        if (!item) {
            return;
        }

        if (item.dataset.key === 'customDate') {
            this.renderCalendar(this.dropdown);
        }
    };
}
