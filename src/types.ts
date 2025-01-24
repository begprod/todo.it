import type { RemovableRef } from '@vueuse/core';
import { mount } from '@vue/test-utils';

export interface ICommonState {
  currentEditingTask: ITask | null;
  currentEditingLabel: ILabel | null;
  lastCalendarUpdateDate: RemovableRef<string>;
  isBacklogOpen: RemovableRef<boolean>;
  isSettingsOpen: boolean;
  isTaskActionMenuOpen: boolean;
  isTaskLabelMenuOpen: boolean;
  isLabelActionMenuOpen: boolean;
  isToastVisible: boolean;
  status: 'default' | 'success' | 'error';
  message: string;
  currentToastTimerId: number;
}

export interface ICalendarStore {
  months: Array<IMonth>;
  days: Array<IDay>;
  shouldGenerateNextMonth: boolean;
}

export interface ITasksState {
  tasks: RemovableRef<Record<string, Record<'items', Array<ITask>>>>;
}

export interface ILabelState {
  scopes: RemovableRef<Array<IScope>>;
  labels: RemovableRef<Array<ILabel>>;
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
  labels: Array<ILabel>;
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

export interface IScope {
  id: string;
  name: string;
  color: string;
}

export interface ILabel extends IScope {
  scopeTitle: string | null;
}

export interface IFilterSearchItem extends ILabel {
  searchString?: string;
}

const mountComponent = <T>(component: T) => mount(component);
export type ComponentWrapperType<T> = ReturnType<typeof mountComponent<T>>;
