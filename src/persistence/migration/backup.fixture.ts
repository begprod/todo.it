import type { IBackupPayload } from '@/persistence/types';

const denormalizedLabel = {
  id: 'label-urgent',
  name: 'Urgent',
  color: '#d33',
  scopeTitle: null,
  searchString: 'urgent',
};

const denormalizedHomeLabel = {
  id: 'label-home',
  name: 'Home',
  color: '#36c',
  scopeTitle: null,
  searchString: 'home',
};

export const backupFixture: IBackupPayload = {
  'todo.it:tasks': {
    '01012026': {
      items: [
        {
          id: 'task-one',
          description: 'First task',
          isDone: false,
          dayId: '01012026',
          labels: [denormalizedLabel],
        },
        {
          id: 'task-two',
          description: 'Second task',
          isDone: true,
          dayId: '01012026',
          labels: [denormalizedHomeLabel],
        },
      ],
    },
    '02012026': { items: [] },
    backlog: {
      items: [
        {
          id: 'task-backlog',
          description: 'Backlog task',
          isDone: false,
          dayId: 'backlog',
          labels: [denormalizedLabel],
        },
      ],
    },
  },
  'todo:labels': [
    { id: 'label-urgent', name: 'Urgent', color: '#d33', scopeTitle: null },
    { id: 'label-home', name: 'Home', color: '#36c', scopeTitle: 'Personal' },
  ],
  'todo:scopes': [
    { id: 'scope-work', name: 'Work', color: '#369' },
    { id: 'scope-personal', name: 'Personal', color: '#693' },
  ],
};
