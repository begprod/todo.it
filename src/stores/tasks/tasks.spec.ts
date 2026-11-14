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
    setTaskProject,
    updateTask,
    moveTask,
    moveToBacklog,
    moveToDay,
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
      priority: 'medium',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should attach and remove a project from a task and ignore missing tasks', () => {
    const dayId = format(new Date(), 'ddMMyyyy');
    const task = tasks.value[dayId].items[0];

    setTaskProject(task.id, dayId, 'project-1');

    expect(task.projectId).toBe('project-1');

    setTaskProject('missing', dayId, 'project-2');
    setTaskProject('missing', 'missing-day', 'project-2');

    expect(task.projectId).toBe('project-1');

    setTaskProject(task.id, dayId, undefined);

    expect(task.projectId).toBeUndefined();
  });

  it('should detect projects used by tasks', () => {
    const dayId = format(new Date(), 'ddMMyyyy');
    const task = tasks.value[dayId].items[0];

    setTaskProject(task.id, dayId, 'project-1');

    expect(tasksStore.isProjectInUse('project-1')).toBe(true);
    expect(tasksStore.isProjectInUse('project-2')).toBe(false);

    setTaskProject(task.id, dayId);

    expect(tasksStore.isProjectInUse('project-1')).toBe(false);
  });

  it('should count done and overall tasks across days and backlog by project', () => {
    const originalTasks = tasks.value;
    const { projectTaskCounts } = storeToRefs(tasksStore);
    const task = {
      id: 'task-a',
      description: '',
      dayId: '06112026',
      isDone: true,
      labels: [],
      projectId: 'project-a',
    };

    tasksStore.tasks = {
      '06112026': { items: [task, { ...task, id: 'unassigned', projectId: undefined }] },
      '07112026': {
        items: [
          { ...task, id: 'task-b', dayId: '07112026', isDone: false },
          { ...task, id: 'task-c', dayId: '07112026', projectId: 'project-b' },
        ],
      },
      backlog: { items: [{ ...task, id: 'task-d', dayId: 'backlog' }] },
    };

    expect(projectTaskCounts.value).toEqual({
      'project-a': { done: 2, overall: 3 },
      'project-b': { done: 1, overall: 1 },
    });
    expect(projectTaskCounts.value['project-without-tasks']).toBeUndefined();

    tasksStore.tasks = originalTasks;
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

  it('should do nothing when moving a task to the same day', () => {
    const { dayId, originalIds } = createThreeTasks();
    const taskId = originalIds[1];

    moveTask(taskId, dayId, dayId);

    const ids = tasks.value[dayId].items.map((task) => task.id);

    expect(ids).toHaveLength(originalIds.length);
    expect(ids).toEqual(originalIds);
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
      priority: 'medium',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should delete task', () => {
    const backlogTaskId = tasks.value.backlog.items[0].id;

    deleteTask(backlogTaskId, 'backlog');

    expect(tasks.value.backlog.items.length).toEqual(1);
    expect(tasks.value.backlog.items[0].id).not.toEqual(backlogTaskId);
  });

  it('should reset lifecycle timestamps when duplicating a task and keep its project and priority', () => {
    const original = tasks.value.backlog.items[0];

    original.createdAt = '2020-01-01T00:00:00.000Z';
    original.updatedAt = '2020-01-02T00:00:00.000Z';
    original.startedAt = '2020-01-03T00:00:00.000Z';
    original.completedAt = '2020-01-04T00:00:00.000Z';
    original.projectId = 'project-1';
    original.priority = 'high';

    duplicateTask(original);

    const copy = tasks.value.backlog.items[1];

    expect(copy.createdAt).toEqual(expect.any(String));
    expect(copy.createdAt).not.toBe(original.createdAt);
    expect(copy.updatedAt).toBe(copy.createdAt);
    expect(copy.updatedAt).not.toBe(original.updatedAt);
    expect(copy.startedAt).toBeUndefined();
    expect(copy.completedAt).toBeUndefined();
    expect(copy).not.toHaveProperty('startedAt');
    expect(copy).not.toHaveProperty('completedAt');
    expect(copy.projectId).toBe('project-1');
    expect(copy.priority).toBe('high');
  });

  it('should move a backlog task to the beginning of a calendar day', () => {
    const dayId = format(new Date(), 'ddMMyyyy');
    const task = tasks.value.backlog.items[0];
    const backlogLength = tasks.value.backlog.items.length;

    createTask(dayId);
    moveToDay(task.id, dayId);

    expect(tasks.value.backlog.items).not.toContain(task);
    expect(tasks.value.backlog.items).toHaveLength(backlogLength - 1);
    expect(tasks.value[dayId].items[0]).toBe(task);
    expect(task.dayId).toBe(dayId);
  });

  it('should create a missing day row when moving a backlog task', () => {
    const dayId = '01011990';
    const task = tasks.value.backlog.items[0];

    expect(tasks.value[dayId]).toBeUndefined();

    moveToDay(task.id, dayId);

    expect(tasks.value[dayId].items).toEqual([task]);
    expect(task.dayId).toBe(dayId);
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
