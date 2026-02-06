import { ISelector, ISelectorClass } from '../selector/ISelector.ts';

export interface ICalendarClass extends ISelectorClass {
    setValue(value: Date | string, label?: string): void;
}

export type ICalendar = Omit<ISelector, 'options'>;
