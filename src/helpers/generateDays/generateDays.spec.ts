import type { IMonth, IDay } from '@/types';
import { describe, it, expect } from 'vitest';
import { generateDays } from '@/helpers/generateDays/generateDays';

describe('generateDays', () => {
  it('correctly return an array of days', () => {
    const months: Array<IMonth> = [
      {
        id: '012021',
        name: 'January',
        monthString: new Date('2021-01-01'),
        isCurrent: true,
      },
    ];

    const days: Array<IDay> = generateDays(months);

    expect(days).toHaveLength(31);
  });
});
