export type TaskStatus =
  | 'queued'
  | 'ready'
  | 'active'
  | 'completed'
  | 'failed';

export interface Task {
  id: string;

  title: string;

  description?: string;

  status: TaskStatus;

  createdAt: string;
  readyAt?: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  result?: unknown;
  error?: string;
}
