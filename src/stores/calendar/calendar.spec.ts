import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import { describe, it, expect } from 'vitest';
import { useCalendarStore } from '@/stores/calendar/calendar';

describe('calendar store', () => {
  const pinia = createPinia();

  setActivePinia(pinia);

  const calendarStore = useCalendarStore();
  const { months, days } = storeToRefs(calendarStore);
  const { getDaysByMonthId, initCalendar } = calendarStore;

  it('should be empty', () => {
    expect(months.value).toEqual([]);
    expect(days.value).toEqual([]);
  });

  it('should generate months and days', () => {
    const minimumThreeMonthsDaysLength = 88;

    initCalendar();

    expect(months.value.length).toBeLessThanOrEqual(4);
    expect(days.value.length).toBeGreaterThan(minimumThreeMonthsDaysLength);
  });

  it('should get days by month id', () => {
    const monthsId = months.value[0].id;
    const monthsLength = getDaysByMonthId(monthsId).length;
    const daysByMonthId = getDaysByMonthId(monthsId);

    expect(daysByMonthId.length).toEqual(monthsLength);
  });
});
