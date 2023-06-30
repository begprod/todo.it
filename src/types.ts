export interface ICalendarStore {
  currentMonth: IMonth;
}

export interface IMonth {
  id: string;
  name: string;
  year: string;
  weeks: Array<IWeek>;
}

export interface IWeek {
  id: string;
  daysInterval: {
    start: string;
    end: string;
  };
  days: Array<IDay>;
  isCurrentWeek: boolean;
}

export interface IDay {
  id: string;
  name: string;
  year: string;
  todos: Array<ITodo>;
}

export interface ITodo {
  id: string;
  name: string;
  description: string;
  isDone: boolean;
}
