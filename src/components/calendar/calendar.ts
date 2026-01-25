import {
    getLastDayOfCurrentMonth,
    getNextDay,
    getNextMonth,
    getNextTwoWeek,
    getNextWeek,
} from '../../utils/dateUtils.ts';
import { Selector } from '../selector/selecor.ts';

import { ICalendar } from './ICalendar.ts';

export class Calendar extends Selector implements ICalendar {
    showCustomDateSelector = false;
    baseOptions = {
        nextDay: {
            value: getNextDay(),
            label: 'День',
        },
        nextWeek: {
            value: getNextWeek(),
            label: 'Неделя',
        },
        nextTwoWeek: {
            value: getNextTwoWeek(),
            label: 'Две недели',
        },
        nextMonth: {
            value: getNextMonth(),
            label: 'Месяц',
        },
        lastDayOfMonth: {
            value: getLastDayOfCurrentMonth(),
            label: 'До конца месяца',
        },
    };

    constructor(data: ICalendar) {
        super(data);
        this.showCustomDateSelector = data.showCustomDateSelector;
    }

    protected override renderOptions(dropdown: HTMLDivElement) {
        const getMenuItem = () => {
            const item = document.createElement('button');
            const span1 = document.createElement('span');
            const span2 = document.createElement('span');

            return { item, span1, span2 };
        };

        Object.entries(this.baseOptions).forEach(([key, value]) => {
            const { item, span1, span2 } = getMenuItem();

            const formatter = new Intl.DateTimeFormat('ru-RU', {
                day: 'numeric',
                month: 'long',
            });

            span1.textContent = value.label;
            span2.textContent = `до ${formatter.format(value.value)}`;

            item.type = 'button';
            item.classList.add('dropdown_menu--item');
            item.dataset.key = key;
            item.dataset.value = `${value.label} (до ${formatter.format(value.value)})`;

            item.appendChild(span1);
            item.appendChild(span2);
            dropdown.appendChild(item);
        });

        const { item, span1, span2 } = getMenuItem();

        span1.textContent = 'Своя дата';

        item.type = 'button';
        item.classList.add('dropdown_menu--item');
        item.dataset.key = 'customDate';
        item.dataset.option = 'offOnDropdownClick';
        item.dataset.value = `Своя дата (до ...)`;

        item.appendChild(span1);
        item.appendChild(span2);
        dropdown.appendChild(item);
    }
}
