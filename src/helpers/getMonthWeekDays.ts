import { format, eachWeekOfInterval, isPast, endOfWeek } from 'date-fns';
import type { IWeek, IDay } from '@/types';

export function getMonthWeekDays(
  startMonth: Date,
  endMonth: Date,
  monthNumber: number,
): Array<IWeek> {
  const monthWeeks = eachWeekOfInterval({ start: startMonth, end: endMonth }, { weekStartsOn: 1 });
  const weeksObjectsArray: Array<IWeek> = [];

  monthWeeks.forEach((monthWeekItem, index) => {
    const week: IWeek = {
      id: format(monthWeekItem, `MMyyyy_${index}`),
      daysInterval: {
        start: '',
        end: '',
      },
      days: [],
      isCurrent: false,
      isPast: false,
      isLast: false,
    };

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(monthWeekItem);

      day.setDate(day.getDate() + i);

      return day;
    });

    const isCurrentMonthDay = weekDays.filter((day) => day.getMonth() === monthNumber);

    const dayObj = isCurrentMonthDay.map((day): IDay => {
      const year = format(day, 'yyyy');
      const month = format(day, 'MMMM');
      const dayString = format(day, 'd');
      const dayName = format(day, 'EEEE');
      const isCurrent = `${dayString}_${month}` === format(new Date(), 'd_MMMM');
      const isPastDay = isPast(day) && !isCurrent;

      return {
        id: format(day, 'ddMMyyyy'),
        year,
        name: `${dayString} ${month} (${dayName})`,
        isCurrent,
        isPast: isPastDay,
      };
    });

    week.days.push(...dayObj);
    week.days.reverse();

    week.daysInterval.start = dayObj[0].name;
    week.daysInterval.end = dayObj[dayObj.length - 1].name;
    week.isCurrent = week.days.some((day) => day.name === format(new Date(), 'd MMMM (EEEE)'));
    week.isPast = isPast(endOfWeek(weekDays[weekDays.length - 1]));
    week.isLast = index === monthWeeks.length - 1;

    weeksObjectsArray.push(week);
  });

  return weeksObjectsArray.reverse();
}
