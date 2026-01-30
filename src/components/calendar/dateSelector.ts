import nextSvg from '../../assets/next.svg';
import prevDisabledSvg from '../../assets/prev-disabled.svg';
import prevSvg from '../../assets/prev.svg';
import { getCurrentDate } from '../../utils/dateUtils.ts';

export class DateSelector {
    calendarNode: HTMLElement | undefined;
    datePickerNode: HTMLElement | undefined;
    prevButtonNode: HTMLButtonElement | undefined;
    nextButtonNode: HTMLButtonElement | undefined;
    currentDate: Date = getCurrentDate();
    selectedDate: Date = getCurrentDate();

    constructor() {
        this.currentDate.setHours(23, 59, 59, 999);
        this.createCalendarNode();
    }

    /**
     * Стабильный formatter
     */
    private formatterDay = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
    });

    /**
     * Стабильный formatter
     */
    private formatterMount = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
    });

    /**
     * Нормализует дату к первому дню месяца (00:00:00.000)
     */
    private getMonthStart(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    }

    /**
     * Синхронизирует состояние кнопки "назад":
     * блокируем, если предыдущий месяц < текущего месяца.
     */
    private syncPrevButtonState(): void {
        if (!this.prevButtonNode) {
            return;
        }

        const currentMonthStart = this.getMonthStart(this.currentDate);
        const prevMonthStart = this.getMonthStart(this.selectedDate);
        prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);

        const disabled = prevMonthStart < currentMonthStart;

        this.prevButtonNode.disabled = disabled;

        const prevImg = document.createElement('img');

        if (disabled) {
            prevImg.src = prevDisabledSvg;

            this.prevButtonNode.replaceChildren(prevImg);
        } else {
            prevImg.src = prevSvg;

            this.prevButtonNode.replaceChildren(prevImg);
        }
    }

    /**
     * Возвращает недели месяца с привязанными числами дней
     * @param {number} year - год
     * @param {number} month - месяц
     * @returns {(Date | null)[][]} массив недель
     */
    private getMonthWeeks(year: number, month: number): (Date | null)[][] {
        const weeks = [];
        let week = [];

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // День недели первого дня (0 = понедельник)
        const startDay = (firstDay.getDay() + 6) % 7;

        // Пустые ячейки до первого дня месяца
        for (let i = 0; i < startDay; i++) {
            week.push(null);
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);

            week.push(date);

            if (week.length === 7) {
                weeks.push(week);
                week = [];
            }
        }

        // Хвост недели
        if (week.length > 0) {
            while (week.length < 7) {
                week.push(null);
            }
            weeks.push(week);
        }

        return weeks;
    }

    private updateDatePicker() {
        if (!this.calendarNode || !this.datePickerNode) {
            return;
        }

        const calendarTitle = this.calendarNode.querySelector('.calendar__title');
        const spanTitle1 = document.createElement('h3');
        const spanTitle2 = document.createElement('h3');

        spanTitle1.textContent = this.selectedDate.toLocaleString('ru-RU', { month: 'long' });
        spanTitle2.textContent = this.selectedDate.toLocaleString('ru-RU', { year: 'numeric' });

        calendarTitle?.replaceChildren(spanTitle1, spanTitle2);

        const mountsData = this.getMonthWeeks(this.selectedDate.getFullYear(), this.selectedDate.getMonth());
        const newDatePicker = this.getDatePickerNode(mountsData);

        this.datePickerNode.replaceWith(newDatePicker);
        this.datePickerNode = newDatePicker;

        this.syncPrevButtonState();
    }

    private handleNextMount() {
        const currentYear = this.selectedDate.getFullYear();
        const currentMount = this.selectedDate.getMonth();

        this.selectedDate.setDate(1);

        if (currentMount === 11) {
            this.selectedDate.setFullYear(currentYear + 1);
            this.selectedDate.setMonth(0);
        } else {
            this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);
        }

        this.updateDatePicker();
    }

    private handlePrevMount() {
        const currentYear = this.selectedDate.getFullYear();
        const currentMount = this.selectedDate.getMonth();

        this.selectedDate.setDate(1);

        if (currentMount === 0) {
            this.selectedDate.setFullYear(currentYear - 1);
            this.selectedDate.setMonth(11);
        } else {
            this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);
        }

        this.updateDatePicker();
    }

    private getDatePickerNode(mountsData: (Date | null)[][]) {
        const datePicker = document.createElement('div');
        datePicker.classList.add('date-picker');

        const weekNode = document.createElement('div');
        weekNode.classList.add('date-picker__week');

        for (let i = 0; i < 7; i++) {
            const dayName = document.createElement('span');
            dayName.classList.add('date-picker__day-name');
            dayName.textContent = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'][i];

            weekNode.appendChild(dayName);
        }

        datePicker.appendChild(weekNode);

        mountsData.forEach((week) => {
            const weekNode = document.createElement('div');
            weekNode.classList.add('date-picker__week');

            week.forEach((day) => {
                const dayNode = document.createElement('button');

                dayNode.classList.add('date-picker__day');
                dayNode.type = 'button';

                if (day) {
                    dayNode.textContent = this.formatterDay.format(day);

                    dayNode.dataset.value = `до ${this.formatterMount.format(day)}`;

                    if (day < this.currentDate) {
                        dayNode.classList.add('date-picker__day--no-active');
                        dayNode.tabIndex = -1;
                        dayNode.disabled = true;
                    }
                } else {
                    dayNode.classList.add('date-picker__day--no-active');
                    dayNode.tabIndex = -1;
                    dayNode.disabled = true;
                }

                weekNode.appendChild(dayNode);
            });

            datePicker.appendChild(weekNode);
        });

        return datePicker;
    }

    private createCalendarNode() {
        const calendar = document.createElement('div');
        calendar.classList.add('calendar');

        const calendarBody = document.createElement('div');
        calendarBody.classList.add('calendar__body');

        const calendarTitle = document.createElement('div');
        const spanTitle1 = document.createElement('h3');
        const spanTitle2 = document.createElement('h3');

        calendarTitle.classList.add('calendar__title');
        spanTitle1.textContent = this.selectedDate.toLocaleString('ru-RU', { month: 'long' });
        spanTitle2.textContent = this.selectedDate.toLocaleString('ru-RU', { year: 'numeric' });

        calendarTitle.appendChild(spanTitle1);
        calendarTitle.appendChild(spanTitle2);

        calendarBody.appendChild(calendarTitle);

        const mountsData = this.getMonthWeeks(this.selectedDate.getFullYear(), this.selectedDate.getMonth());

        const datePicker = this.getDatePickerNode(mountsData);

        calendarBody.appendChild(datePicker);

        calendar.appendChild(calendarBody);

        const prev = document.createElement('button');
        const next = document.createElement('button');
        const prevImg = document.createElement('img');
        const nextImg = document.createElement('img');

        prev.classList.add('calendar__btn', 'calendar__prev');
        next.classList.add('calendar__btn', 'calendar__next');

        prev.type = 'button';
        next.type = 'button';

        prevImg.src = prevSvg;
        nextImg.src = nextSvg;

        prev.appendChild(prevImg);
        next.appendChild(nextImg);

        calendar.appendChild(prev);
        calendar.appendChild(next);

        this.prevButtonNode = prev;
        this.nextButtonNode = next;
        this.datePickerNode = datePicker;
        this.calendarNode = calendar;

        this.syncPrevButtonState();

        prev.addEventListener('click', this.handlePrevMount.bind(this));
        next.addEventListener('click', this.handleNextMount.bind(this));
    }

    public destroy() {
        this.prevButtonNode?.removeEventListener('click', this.handlePrevMount.bind(this));
        this.nextButtonNode?.removeEventListener('click', this.handleNextMount.bind(this));

        this.calendarNode?.remove();

        this.calendarNode = undefined;
        this.prevButtonNode = undefined;
        this.nextButtonNode = undefined;
    }

    public getNode() {
        if (!this.calendarNode) {
            return document.createElement('div');
        }

        return this.calendarNode;
    }
}
