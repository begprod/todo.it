import type { IMonth } from '@/types';
import { format } from 'date-fns';
import { describe, it, expect } from 'vitest';
import { generateMonths } from '@/helpers/generateMonths/generateMonths';

describe('generateMonths', () => {
  it('should return an array of months', () => {
    const months: Array<IMonth> = generateMonths(2);

    expect(months).toHaveLength(3);
  });

  it('should return an array of next months with pass offset argument', () => {
    const months: Array<IMonth> = generateMonths(2, 1);
    const currentDate = new Date();
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const nextMonthName = format(nextMonth, 'MMMM');

    expect(months).toHaveLength(3);
    expect(months[0].name).toBe(nextMonthName);
  });
});
