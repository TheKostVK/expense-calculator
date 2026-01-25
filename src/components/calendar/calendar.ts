import { getNextDay, getNextMonth, getNextTwoWeek, getNextWeek } from '../../utils/dateUtils.ts';
import { Selector } from '../selector/selecor.ts';

import { ICalendar } from './ICalendar.ts';

export class Calendar extends Selector implements ICalendar {
    showCustomDateSelector = false;
    currentDate = new Date();
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
    };

    constructor(data: ICalendar) {
        super(data);
        this.showCustomDateSelector = data.showCustomDateSelector;
    }

    protected override renderOptions(dropdown: HTMLDivElement) {
        Object.entries(this.baseOptions).forEach(([key, value]) => {
            const item = document.createElement('button');
            const span1 = document.createElement('span');
            const span2 = document.createElement('span');
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
    }
}
