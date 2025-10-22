// shared/types/task.ts
export type TaskStatus =
  | 'queued'
  | 'ready'
  | 'active'
  | 'completed'
  | 'failed';

export interface createtaskDTO {
  title: string;
  description?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskResponseDTO {
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

export interface TaskListItemDTO {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
}
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
export interface CreateTaskJobData {
  task: Task;
}

export interface UpdateTaskJobData {
  id: string;
  body: UpdateTaskJob;
}
export interface UpdateTaskJob {
 title?: string;
 description?: string;
 status?: TaskStatus;
}
export interface DeleteTaskJobData {
  id: string;
}
export type TaskJobData = CreateTaskJobData | UpdateTaskJobData | DeleteTaskJobData;
