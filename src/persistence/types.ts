import type { ILabel, IScope, ITask } from '@/types';

export interface ITaskRow {
  dayId: string;
  items: Array<ITask>;
}

export interface IMigrationCounts {
  days: number;
  tasks: number;
  scopes: number;
  labels: number;
}

export interface IMigrationMeta {
  key: 'migration.localStorage';
  status: 'done';
  source: 'localStorage' | 'empty' | 'existing';
  at: string;
  lsCleaned: boolean;
  counts: IMigrationCounts;
}

export interface IPreMigrationBackup {
  key: 'backup.preMigration';
  at: string;
  raw: Partial<Record<'todo.it:tasks' | 'todo:labels' | 'todo:scopes', string>>;
}

export interface IBackupPayload {
  'todo:scopes'?: Array<IScope>;
  'todo:labels'?: Array<ILabel>;
  'todo.it:tasks'?: Record<string, { items: Array<ITask> }>;
  [key: string]: unknown;
}

export interface IPersistenceStatus {
  mode: 'indexeddb' | 'legacy' | 'error';
  error?: Error;
}
