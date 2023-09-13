import type { RemovableRef } from '@vueuse/core';

export interface ICommonState {
  currentEditingTask: ITask | null;
  lastCalendarUpdateDate: RemovableRef<string>;
  isSidebarOpen: RemovableRef<boolean>;
  isActionMenuOpen: boolean;
}

export interface ITasksState {
  months: Array<IMonth>;
  tasks: RemovableRef<Record<string, Record<'items', Array<ITask>>>>;
}

export interface IMonth {
  id: string;
  name: string;
  year: string;
  weeks: Array<IWeek>;
  isCurrent: boolean;
}

export interface IWeek {
  id: string;
  days: Array<IDay>;
  isCurrent: boolean;
  isLast: boolean;
}

export interface IDay {
  id: string;
  name: string;
  year: string;
  isCurrent: boolean;
  isPast: boolean;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  isDone: boolean;
  dayId: IDay['id'] | 'backlog';
}

export interface IOnDragChangeEvent {
  to: HTMLElement;
  added: {
    element: ITask;
  };
  removed: {
    element: ITask;
  };
}
