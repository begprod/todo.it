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
    copyTask,
    deleteTask,
  } = tasksStore;
  const { initCalendar } = calendarStore;

  initCalendar();

  it('should init tasks object', () => {
    const minimumThreeMonthsDaysLength = 89;
    const backlogLength = 1;
    initTasksObject();

    expect(Object.keys(tasks.value).length).toBeGreaterThan(
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
      title: '',
      description: '',
      dayId: currentDayId,
      isDone: false,
    });
  });

  it('should update task', () => {
    const currentDayId = format(new Date(), 'ddMMyyyy');
    const taskId = tasks.value[currentDayId].items[0].id;

    updateTask(taskId, currentDayId, 'title', 'test title');
    updateTask(taskId, currentDayId, 'description', 'test description');
    updateTask(taskId, currentDayId, 'isDone', true);

    expect(tasks.value[currentDayId].items[0].title).toEqual('test title');
    expect(tasks.value[currentDayId].items[0].description).toEqual('test description');
    expect(tasks.value[currentDayId].items[0].isDone).toEqual(true);
  });

  it('should move to backlog', () => {
    const currentDayId = format(new Date(), 'ddMMyyyy');
    const taskId = tasks.value[currentDayId].items[0].id;

    moveToBacklog(taskId, currentDayId);

    expect(tasks.value[currentDayId].items.length).toEqual(0);
    expect(tasks.value.backlog.items.length).toEqual(1);
    expect(tasks.value.backlog.items[0].id).toEqual(taskId);
  });

  it('should copy task', () => {
    const backlogTaskId = tasks.value.backlog.items[0].id;

    copyTask({
      id: backlogTaskId,
      title: 'test title',
      description: 'test description',
      isDone: false,
      dayId: 'backlog',
    });

    expect(tasks.value.backlog.items.length).toEqual(2);
    expect(tasks.value.backlog.items[0].id).toEqual(backlogTaskId);
    expect(tasks.value.backlog.items[1]).toEqual({
      id: expect.any(String),
      title: 'test title',
      description: 'test description',
      dayId: 'backlog',
      isDone: false,
    });
  });

  it('should delete task', () => {
    const backlogTaskId = tasks.value.backlog.items[0].id;

    deleteTask(backlogTaskId, 'backlog');

    expect(tasks.value.backlog.items.length).toEqual(1);
    expect(tasks.value.backlog.items[0].id).not.toEqual(backlogTaskId);
  });
});
