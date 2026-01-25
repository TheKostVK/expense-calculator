import { ISelector } from '../selector/ISelector.ts';

export interface ICalendar extends Omit<ISelector, 'options'> {
    showCustomDateSelector: boolean;
}
