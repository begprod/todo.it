import { eachWeekOfInterval, format } from 'date-fns';
import type { IWeek, IDay } from '@/types';

export function getMonthWeekDays(startMonth: Date, endMonth: Date, monthNumber: number): Array<IWeek> {
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
    };

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(monthWeekItem);

      day.setDate(day.getDate() + i);

      return day;
    });

    const isCurrentMonthDay = weekDays.filter((day) => day.getMonth() === monthNumber);

    const dayObj = isCurrentMonthDay
      .map((day): IDay => {
        const year = format(day, 'yyyy');
        const month = format(day, 'MMMM');
        const dayString = format(day, 'd');
        const dayName = format(day, 'EEEE');

        return {
          id: format(day, 'ddMMyyyy'),
          year,
          name: `${dayString} ${month} (${dayName})`,
        };
      });

    week.days = dayObj;
    week.daysInterval.start = dayObj[0].name;
    week.daysInterval.end = dayObj[dayObj.length - 1].name;

    weeksObjectsArray.push(week);
  });

  return weeksObjectsArray.reverse();
}
