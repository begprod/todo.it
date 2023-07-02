import { eachWeekOfInterval, format } from 'date-fns';
import { type IWeek, type IDay } from '@/types';

export function getMonthWeekDays(currentDate: Date, startMonth: Date, endMonth: Date): Array<IWeek> {
  const monthWeeks = eachWeekOfInterval({ start: startMonth, end: endMonth }, { weekStartsOn: 1 });
  const weekObjects: Array<IWeek> = [];

  monthWeeks.forEach((monthWeekItem, index) => {
    const week: IWeek = {
      id: format(monthWeekItem, `MMyyyy_${index}`),
      daysInterval: {
        start: '',
        end: '',
      },
      days: [] as any,
      isCurrentWeek: false,
    };

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(monthWeekItem);

      day.setDate(day.getDate() + i);

      return day;
    });

    const isCurrentMonthDay = weekDays.filter((day) => day.getMonth() === currentDate.getMonth());

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
          todos: [],
        };
      });

    week.days = dayObj;
    week.daysInterval.start = dayObj[0].name;
    week.daysInterval.end = dayObj[dayObj.length - 1].name;
    // week.isCurrentWeek = week.daysInterval.start.includes(format(currentDate, 'd'));

    weekObjects.push(week);
  });

  return weekObjects;
}
