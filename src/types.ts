import type { RemovableRef } from '@vueuse/core';

export interface ICommonState {
  currentEditingTask: ITask | null;
  lastCalendarUpdateDate: RemovableRef<string>;
  isSidebarOpen: RemovableRef<boolean>;
  isActionMenuOpen: boolean;
}

export interface ITasksState {
  months: Array<IMonth>;
  days: Array<IDay>;
  tasks: RemovableRef<Record<string, Record<'items', Array<ITask>>>>;
}

export interface IMonth {
  id: string;
  name: string;
  year: string;
  monthString: Date;
  isCurrent: boolean;
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
