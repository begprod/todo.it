import { format, eachWeekOfInterval, isPast, endOfWeek } from 'date-fns';
import type { IWeek, IDay } from '@/types';

export function generateWeeks(startMonth: Date, endMonth: Date, monthNumber: number): Array<IWeek> {
  const monthWeeks = eachWeekOfInterval({ start: startMonth, end: endMonth }, { weekStartsOn: 1 });

  const weekArr: Array<IWeek> = monthWeeks.map((monthWeekItem, index) => {
    const week = createWeekObject(monthWeekItem, index);
    const weekDays = generateWeekDays(monthWeekItem);
    const currentMonthDays = weekDays.filter((day) => day.getMonth() === monthNumber);
    const dayObj = mapDayToDayObject(currentMonthDays);

    week.days.push(...dayObj);
    week.days.reverse();

    week.daysInterval.start = dayObj[0].name;
    week.daysInterval.end = dayObj[dayObj.length - 1].name;
    week.isCurrent = week.days.some((day) => day.name === format(new Date(), 'd MMMM (EEEE)'));
    week.isPast = isPast(endOfWeek(weekDays[weekDays.length - 1]));
    week.isLast = index === monthWeeks.length - 1;

    return week;
  });

  return weekArr.reverse();
}

function createWeekObject(date: Date, index: number): IWeek {
  const week = {
    id: format(date, `MMyyyy_${index}`),
    daysInterval: {
      start: '',
      end: '',
    },
    days: [],
    isCurrent: false,
    isPast: false,
    isLast: false,
  };

  return week;
}

function generateWeekDays(date: Date): Array<Date> {
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(date);
    day.setDate(day.getDate() + i);
    return day;
  });
}

function mapDayToDayObject(days: Array<Date>): Array<IDay> {
  return days.map(
    (day): IDay => ({
      id: format(day, 'ddMMyyyy'),
      year: format(day, 'yyyy'),
      name: `${format(day, 'd MMMM (EEEE)')}`,
      isCurrent: format(day, 'd_MMMM') === format(new Date(), 'd_MMMM'),
      isPast: isPast(day) && format(day, 'd_MMMM') !== format(new Date(), 'd_MMMM'),
    }),
  );
}
