// types/task.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'queued' | 'active' | 'completed' | 'failed';
  createdAt: string;
  updatedAt?: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  result?: any;
  error?: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
}

// Job data sent to the queue
export type TaskJobData =
  | { type: 'create'; body: CreateTaskDTO }
  | { type: 'update'; id: string; body: Partial<CreateTaskDTO> }
  | { type: 'delete'; id: string };
