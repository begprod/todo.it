import { format, startOfMonth, endOfMonth } from 'date-fns';
import type { IMonth, IWeek } from '@/types';
import { generateWeeks } from '@/helpers';

export function generateMonths(
  numberOfMonths: number,
  offsetFromCurrentMonth: number = 0,
): Array<IMonth> {
  const currentDate = new Date();
  const months: Array<IMonth> = [];

  for (let i = 0; i <= numberOfMonths; i++) {
    const offset = i === 0 ? offsetFromCurrentMonth : -i;
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    const monthNumber = month.getMonth();
    const monthDays = generateWeeks(startOfMonth(month), endOfMonth(month), monthNumber);
    const isCurrent = monthNumber === currentDate.getMonth();
    const monthObj = createMonthObject(month, monthDays, isCurrent);

    months.push(monthObj);
  }

  return months;
}

function createMonthObject(month: Date, monthDays: Array<IWeek>, isCurrent: boolean) {
  const monthObj: IMonth = {
    id: format(month, 'MMyyyy'),
    name: format(month, 'MMMM'),
    year: format(month, 'yyyy'),
    weeks: monthDays,
    isCurrent,
  };

  return monthObj;
}
