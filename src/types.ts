export interface ICalendarStore {
  currentDate: Date;
  months: Array<IMonth>;
  allTodos: Array<ITodo>;
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
}

export interface IDay {
  id: string;
  name: string;
  year: string;
}

export interface ITodo {
  id: string;
  title: string;
  description: string;
  isDone: boolean;
  dayId: IDay['id'] | null;
}
