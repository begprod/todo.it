import { format } from 'date-fns';
import type { IMonth } from '@/types';

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
    const isCurrent = monthNumber === currentDate.getMonth();

    months.push({
      id: format(month, 'MMyyyy'),
      name: format(month, 'MMMM'),
      monthString: month,
      isCurrent,
    });
  }

  return months;
}
