import type { RemovableRef } from '@vueuse/core';
import type { Component } from 'vue';
import { mount } from '@vue/test-utils';

export interface ICommonState {
  currentViewType: RemovableRef<string>;
  lastCalendarUpdateDate: RemovableRef<string>;
  isToastVisible: boolean;
  status: 'default' | 'success' | 'error';
  message: string;
  currentToastTimerId: number;
}

export interface IPopupsState {
  currentEditingTask: ITask | null;
  currentEditingLabel: ILabel | null;
  isTaskActionMenuOpen: boolean;
  isTaskLabelMenuOpen: boolean;
  isLabelActionMenuOpen: boolean;
  isProjectFormOpen: boolean;
}

export interface IProject {
  id: string;
  title: string;
  color: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICalendarStore {
  months: Array<IMonth>;
  days: Array<IDay>;
  shouldGenerateNextMonth: boolean;
}

export interface ITasksState {
  tasks: Record<string, Record<'items', Array<ITask>>>;
}

export interface ILabelState {
  scopes: Array<IScope>;
  labels: Array<ILabel>;
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

export interface IMenuItem {
  name: string;
  title: string;
  to?: string;
  icon?: Component;
}
