export interface ICalendarStore {
  currentDate: Date;
  months: Array<IMonth>;
  backlog: Array<ITask>;
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
  daysInterval: {
    start: string;
    end: string;
  };
  days: Array<IDay>;
  isCurrent: boolean;
  isPast: boolean;
  isLast: boolean;
}

export interface IDay {
  id: string;
  name: string;
  year: string;
  tasks: Array<ITask>;
  isCurrent: boolean;
  isPast: boolean;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  isDone: boolean;
  dayId: IDay['id'] | null;
}

export interface IOnDragChangeEvent {
  added: {
    element: ITask;
  }
}
