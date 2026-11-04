import { format } from 'date-fns';
import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import { describe, it, expect } from 'vitest';
import { useTasksStore, useCalendarStore } from '@/stores';

describe('common store', () => {
  const pinia = createPinia();

  setActivePinia(pinia);

  const tasksStore = useTasksStore();
  const calendarStore = useCalendarStore();
  const { days } = storeToRefs(calendarStore);
  const { tasks } = storeToRefs(tasksStore);
  const {
    initTasksObject,
    createTasksByDayObject,
    createTask,
    updateTask,
    moveToBacklog,
    duplicateTask,
    deleteTask,
  } = tasksStore;
  const { initCalendar } = calendarStore;

  const createThreeTasks = () => {
    const dayId = days.value.find((day) => tasks.value[day.id].items.length === 0)?.id;

    if (!dayId) {
      throw new Error('No empty day available for task ordering test');
    }

    createTask(dayId);
    createTask(dayId);
    createTask(dayId);

    return {
      dayId,
      originalIds: tasks.value[dayId].items.map((task) => task.id),
    };
  };

  initCalendar();

  it('should init tasks object', () => {
    const minimumThreeMonthsDaysLength = 89;
    const backlogLength = 1;
    initTasksObject();

    expect(Object.keys(tasks.value).length).toBeGreaterThanOrEqual(
      minimumThreeMonthsDaysLength + backlogLength,
    );

    expect(
      Object.keys(tasks.value).every((task) =>
        days.value.some((day) => day.id === task || task === 'backlog'),
      ),
    ).toEqual(true);
  });

  it('should create tasks by day object', () => {
    createTasksByDayObject();

    expect(Object.values(tasks.value).every((task) => task.items)).toEqual(true);
  });

  it('should create task', () => {
    const currentDayId = format(new Date(), 'ddMMyyyy');

    createTask(currentDayId);

    expect(tasks.value[currentDayId].items.length).toEqual(1);
    expect(tasks.value[currentDayId].items[0].dayId).toEqual(currentDayId);
    expect(tasks.value[currentDayId].items[0]).toEqual({
      id: expect.any(String),
      description: '',
      dayId: currentDayId,
      isDone: false,
      labels: [],
    });
  });

  it('should update task', () => {
    const currentDayId = format(new Date(), 'ddMMyyyy');
    const taskId = tasks.value[currentDayId].items[0].id;

    updateTask(taskId, currentDayId, 'description', 'test description');
    updateTask(taskId, currentDayId, 'isDone', true);

    expect(tasks.value[currentDayId].items[0].description).toEqual('test description');
    expect(tasks.value[currentDayId].items[0].isDone).toEqual(true);
  });

  it('should move a completed task to the end without changing the task ids or count', () => {
    const { dayId, originalIds } = createThreeTasks();
    const taskId = tasks.value[dayId].items[1].id;

    updateTask(taskId, dayId, 'isDone', true);

    const { items } = tasks.value[dayId];

    expect(items[items.length - 1].id).toEqual(taskId);
    expect(items.length).toEqual(3);
    expect(items.map((task) => task.id).sort()).toEqual(originalIds.sort());
  });

  it('should move an undone task to the beginning without changing the task ids or count', () => {
    const { dayId, originalIds } = createThreeTasks();
    const taskId = tasks.value[dayId].items[1].id;

    updateTask(taskId, dayId, 'isDone', true);
    updateTask(taskId, dayId, 'isDone', false);

    const { items } = tasks.value[dayId];

    expect(items[0].id).toEqual(taskId);
    expect(items[0].isDone).toEqual(false);
    expect(items.length).toEqual(3);
    expect(items.map((task) => task.id).sort()).toEqual(originalIds.sort());
  });

  it('should move to backlog', () => {
    const currentDayId = format(new Date(), 'ddMMyyyy');
    const taskId = tasks.value[currentDayId].items[0].id;

    moveToBacklog(taskId, currentDayId);

    expect(tasks.value[currentDayId].items.length).toEqual(0);
    expect(tasks.value.backlog.items.length).toEqual(1);
    expect(tasks.value.backlog.items[0].id).toEqual(taskId);
  });

  it('should duplicate task', () => {
    const backlogTask = tasks.value.backlog.items[0];

    duplicateTask(backlogTask);

    expect(tasks.value.backlog.items.length).toEqual(2);
    expect(tasks.value.backlog.items[0]).toEqual(backlogTask);
    expect(tasks.value.backlog.items[1].id).not.toEqual(backlogTask.id);
    expect(tasks.value.backlog.items[1]).toEqual({
      id: expect.any(String),
      description: 'test description',
      dayId: 'backlog',
      isDone: false,
      labels: [],
    });
  });

  it('should delete task', () => {
    const backlogTaskId = tasks.value.backlog.items[0].id;

    deleteTask(backlogTaskId, 'backlog');

    expect(tasks.value.backlog.items.length).toEqual(1);
    expect(tasks.value.backlog.items[0].id).not.toEqual(backlogTaskId);
  });

  it('should create missing calendar days when the tasks map is already populated', () => {
    tasks.value = { backlog: { items: [] } };

    initTasksObject();

    expect(
      days.value.every((day) => Object.prototype.hasOwnProperty.call(tasks.value, day.id)),
    ).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(tasks.value, 'backlog')).toBe(true);
  });
});
