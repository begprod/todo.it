import type { RemovableRef } from '@vueuse/core';
import { mount } from '@vue/test-utils';

export interface ICommonState {
  currentEditingTask: ITask | null;
  lastCalendarUpdateDate: RemovableRef<string>;
  isBacklogOpen: RemovableRef<boolean>;
  isSettingsOpen: boolean;
  isActionMenuOpen: boolean;
}

export interface ICalendarStore {
  months: Array<IMonth>;
  days: Array<IDay>;
  shouldGenerateNextMonth: boolean;
}

export interface ITasksState {
  tasks: RemovableRef<Record<string, Record<'items', Array<ITask>>>>;
}

export interface IMonth {
  id: string;
  name: string;
  monthString: Date;
  isCurrent: boolean;
}

export interface IDay {
  id: string;
  monthId: IMonth['id'];
  number: string;
  name: string;
  isCurrent: boolean;
  isPast: boolean;
}

export interface ITask {
  id: string;
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

const mountComponent = <T>(component: T) => mount(component);
export type ComponentWrapperType<T> = ReturnType<typeof mountComponent<T>>;
