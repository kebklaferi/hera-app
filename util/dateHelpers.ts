import { addDays, format } from 'date-fns';

export interface CalendarDay {
    key: string;
    day: string;
    date: string;
    isToday: boolean;
}

export const getSurroundingDays = (range = 2): CalendarDay[] => {
    const today = new Date();
    const offsets = Array.from({ length: range * 2 + 1 }, (_, i) => i - range);

    return offsets.map((offset) => {
        const date = addDays(today, offset);
        return {
            key: date.toISOString(),
            day: format(date, 'EEE').toUpperCase(),
            date: format(date, 'd'),
            isToday: offset === 0,
        };
    });
};
export interface MonthYearI {
    month: string,
    year: string
}
export const getCurrentMonthAndYear = (): MonthYearI => {
    const today = new Date();
    const year = format(today, 'yyyy');
    const month = format(today, 'LLLL').toUpperCase();
    return ({
        month: month,
        year: year
    })
}

export function fromDateString(dateStr: string): Date {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export function toDateString(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

export const refactorDateToDate = (date: Date): Date => {
    const stringDate = toDateString(date);
    return fromDateString(stringDate);
}
